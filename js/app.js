// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('app.profile-courses', {
    url: '/profile-courses',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile-courses.html',
        controller: 'ProfileCoursesCtrl'
      }
    }
  })

  .state('app.add-course-assessment', {
    url: '/add-course-assessment?key',
    views: {
      'menuContent': {
        templateUrl: 'templates/add-course-assessment.html',
        controller : 'AssessmentsCtrl'
      }
    }
  })

  .state('app.view-course-assessments', {
    url: '/view-course-assessments?key',
    views: {
      'menuContent': {
        templateUrl: 'templates/view-course-assessments.html',
        controller : 'AssessmentsCtrl'
      }
    }
  })

  .state('app.edit-course-assessment', {
    url: '/edit-course-assessment?key&assessmentId&assessmentType&grade',
    views: {
      'menuContent': {
        templateUrl: 'templates/edit-course-assessment.html',
        controller : 'AssessmentsCtrl'
      }
    }
  })

  .state('app.profile-add-course', {
    url: '/profile-add-course?key&course&grade&startDate&edit',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile-add-course.html',
        controller: 'CoursesCtrl'
      }
    }
  })

  .state('app.add-university', {
    url: '/add-university',
    views: {
      'menuContent': {
        templateUrl: 'templates/add-university.html',
        controller: 'HelperCtrl'
      }
    }
  })

  .state('app.add-degree', {
    url: '/add-degree',
    views: {
      'menuContent': {
        templateUrl: 'templates/add-degree.html',
        controller: 'HelperCtrl'
      }
    }
  })

  .state('app.add-course', {
    url: '/add-course',
    views: {
      'menuContent': {
        templateUrl: 'templates/add-course.html',
        controller: 'HelperCtrl'
      }
    }
  })

    .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html',
          controller: 'AboutCtrl'
        }
      }
    })
  ;

  $urlRouterProvider.otherwise('/app/home');
}])

.controller('AppCtrl', ['$scope', '$state', function($scope, $state){

  $scope.signOut = function(){
    localStorage.removeItem('firebase:session::learn-my-stats');
    $state.go('login');
  };
}])

.controller("AboutCtrl", [function(){
  console.log("About Controller Executed")
}])

.controller("HomeCtrl", ['$scope', '$firebaseObject', '$state', function($scope, $firebaseObject, $state){

  $scope.authData = JSON.parse(localStorage.getItem('firebase:session::learn-my-stats'));
  if($scope.authData == null) {
    /* display error indicating user is not logged in. */
    console.log("User not logged in, redirecting to home/login screen");
    $state.go('login');
    return;
  }

  $scope.init = function() {
    var refUser = new Firebase("https://learn-my-stats.firebaseio.com/profiles/" + $scope.authData.uid);
    var userData = $firebaseObject(refUser);

    /* load the user data for display. */
    userData.$loaded().then(function () {
      $scope.university = userData.university;
      $scope.degree = userData.degree;
      $scope.startDate = new Date(JSON.parse(userData.startDate));
    });
  };

  $scope.goCourse = function(){
    $state.go("app.profile-courses");
  };

  $scope.goProfile = function(){
    $state.go("app.profile");
  }


}])

.controller('LoginCtrl', ['$scope', '$state', function($scope, $state){

  $scope.authData = JSON.parse(localStorage.getItem('firebase:session::learn-my-stats'));

  /* user is logged in. */
  if($scope.authData !== null){
    console.log("User was logged in previously");
    $state.go('app.profile');
  }

  /* function to sign the user in via facebook. */
  $scope.signInFB = function(){
    var ref = new Firebase("https://learn-my-stats.firebaseio.com");

    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("DEBUG: SIGNIN FAILED.", error);
      }
      else {
        console.log("DEBUG: SIGNIN SUCCESS.", authData);
        $state.go('app.profile');
      }
    });
  };

  /* function to sign the user in via google. */
  $scope.signInGoogle = function(){
    var ref = new Firebase("https://learn-my-stats.firebaseio.com");


    chrome.identity.getAuthToken({
        interactive: true
    }, function(token) {
        localStorage.setItem("token",token);
        if (chrome.runtime.lastError) {
            alert(chrome.runtime.lastError.message);
            return;
        }

        // Authenticate with Google using an existing OAuth 2.0 access token
        ref.authWithOAuthToken("google", token, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            $state.go("app.profile");
          }
        });


    });

  };



  $scope.signOut = function(){
    localStorage.removeItem('firebase:session::learn-my-stats');
    $state.go('login');
  };

}])

.controller('ProfileCtrl', ['$scope', '$firebaseObject', '$state', function($scope, $firebaseObject, $state){

  console.log("Logged In");

  $scope.authData = null;
  $scope.universities = null;
  $scope.degrees = null;
  $scope.university = null;
  $scope.degree = null;
  $scope.startDate = null;

  $scope.init = function(){
    $scope.authData = JSON.parse(localStorage.getItem('firebase:session::learn-my-stats'));
    if($scope.authData == null) {
        /* display error indicating user is not logged in. */
      console.log("User not logged in, redirecting to home/login screen");
      $state.go('login');
      return;
    }
    else {
      /* TODO do a check to ensure session has not expired. */
    }

    /* this will retrieve the list of universities from firebase. */
    var refUniversities = new Firebase("https://learn-my-stats.firebaseio.com/universities");
    $scope.universities = $firebaseObject(refUniversities);

    /* this will retrieve the list of degrees from firebase */
    var refDegrees = new Firebase("https://learn-my-stats.firebaseio.com/degrees");
    $scope.degrees = $firebaseObject(refDegrees);

    /* need to retrieve university, degree, startDate from firebase if already set. */
    var refUser = new Firebase("https://learn-my-stats.firebaseio.com/profiles/" + $scope.authData.uid);

    var userData = $firebaseObject(refUser);

    /* load the user data for display. */
    userData.$loaded().then(function() {
      $scope.university = userData.university;
      $scope.degree = userData.degree;
      $scope.startDate = new Date(JSON.parse(userData.startDate));
      $scope.reminderPeriod = userData.period || "Monthly";
      var dTemp = new Date();
      if (userData.time){
        dTemp = new Date(2015, 01, 01, userData.time.hour, userData.time.minute)
      }
      $scope.reminderTime = dTemp;
    });
  };

  /* this function will save profile data to firebase. */
  $scope.save = function(university, degree, startDate,reminderPeriod, reminderTime){

    var ref = new Firebase("https://learn-my-stats.firebaseio.com/profiles/" + $scope.authData.uid);

    startDate = JSON.stringify(startDate);
    reminder = {
      hour: reminderTime.getHours(),
      minute: reminderTime.getMinutes()
    };

    ref.update({
      'name' : $scope.authData[$scope.authData.provider].displayName,
      'university' : university,
      'degree' : degree,
      'startDate' : startDate,
      'time' : reminder,
      'period' : reminderPeriod
    });

    /* save alert. */
    if (navigator.notification && navigator.notification.alert)
      navigator.notification.alert('Profile Information Saved.', function(){
        $state.go("app.home");
      }, "Profile");

  };


}])

.controller('ProfileCoursesCtrl',['$scope', '$firebaseObject', function($scope, $firebaseObject){

  $scope.courses = null;

  $scope.init = function(){

    $scope.authData = JSON.parse(localStorage.getItem('firebase:session::learn-my-stats'));

    if($scope.authData == null) {

    }
    else {

    }


    /* pull all courses this user has done with grade details. */
    var ref = new Firebase("https://learn-my-stats.firebaseio.com/profile-grades/" + $scope.authData.uid);
    $scope.courses = $firebaseObject(ref);
  };


}])

.controller('CoursesCtrl',['$scope', '$stateParams', '$state', '$firebaseObject', function($scope, $stateParams, $state, $firebaseObject){

  $scope.key = $stateParams.key;
  $scope.courses = null;
  $scope.authData = null;

  $scope.course = null;
  $scope.grade = null;
  $scope.startDate = null;
  $scope.edit = false;

  $scope.init = function(){

    /* pass a query parameter to determine if a new course is being added or edited,
      and then load the data in the fields.
     */
     if($scope.key !== undefined) {
       $scope.course = $stateParams.course;
       $scope.grade = $stateParams.grade;
       $scope.startDate = new Date(JSON.parse($stateParams.startDate));
     }

     /* addition of assessments needed to add this. */
     if($stateParams.edit !== undefined){
      $scope.edit = $stateParams.edit;
     }

    $scope.authData = JSON.parse(localStorage.getItem('firebase:session::learn-my-stats'));

    /* this will retrieve the list of courses from firebase */
    var refCourses = new Firebase("https://learn-my-stats.firebaseio.com/courses");
    $scope.courses = $firebaseObject(refCourses);

    /* this will retrieve the list of grades from firebase */
    var refGrades = new Firebase("https://learn-my-stats.firebaseio.com/grades");
    $scope.grades = $firebaseObject(refGrades);

  };

  /* saves a course to a user profile. */
  $scope.save = function(course, grade, startDate){
    var ref = null;

    if(course === null || grade === null || startDate === null){
      navigator.notification.alert('Error: One or More Fields Left Blank.', function(){}, "Courses");
    }
    else{
      if($scope.key !== undefined){
        ref = new Firebase("https://learn-my-stats.firebaseio.com/profile-grades/" + $scope.authData.uid + "/" + $scope.key);
        startDate = JSON.stringify(startDate);

        ref.set({
          "course" : course,
          "grade" : grade,
          "startDate" : startDate
        });

        navigator.notification.alert('Course Added Successfully To Profile.', function(){}, "Courses");
        $state.go("app.profile-courses");
      }
      else{
        ref = new Firebase("https://learn-my-stats.firebaseio.com/profile-grades/" + $scope.authData.uid);
        startDate = JSON.stringify(startDate);

        ref.push({
          "course" : course,
          "grade" : grade,
          "startDate" : startDate
        });

        navigator.notification.alert('Course Added Successfully To Profile.', function(){}, "Courses");
        $state.go("app.profile-courses");
      }
    }

  };

}])

.controller('AssessmentsCtrl', ['$scope', '$firebaseObject', '$stateParams', function($scope, $firebaseObject, $stateParams){

  $scope.authData = null;
  $scope.grade = null;
  $scope.grades = null;
  $scope.course = null;
  $scope.courses = null;
  $scope.assessmentTypes = null;
  $scope.assessments = null;
  $scope.assessmentId = null ;
  $scope.key = null;

  $scope.view_init = function(){

    $scope.authData = JSON.parse(localStorage.getItem('firebase:session::learn-my-stats'));

    /* get course id from stateParams */
    $scope.key = $stateParams.key;

    var refCourseAssessments = new Firebase("https://learn-my-stats.firebaseio.com/profile-grades/" + $scope.authData.uid + "/" + $scope.key + "/assessments");
    $scope.assessments = $firebaseObject(refCourseAssessments);

  };

  /* used by both edit / add assessment. */
  $scope.init = function(){

    $scope.authData = JSON.parse(localStorage.getItem('firebase:session::learn-my-stats'));

    /* get the list of courses. */
    var refCourses = new Firebase("https://learn-my-stats.firebaseio.com/courses");
    $scope.courses = $firebaseObject(refCourses);

    /* get the list of grades. */
    var refGrades = new Firebase("https://learn-my-stats.firebaseio.com/grades");
    $scope.grades = $firebaseObject(refGrades);

    /* get the list of assessment types. */
    var assessmentTypes = new Firebase("https://learn-my-stats.firebaseio.com/assessment-types");
    $scope.assessmentTypes = $firebaseObject(assessmentTypes);

    /* get the key from the stateParams */
    $scope.key = $stateParams.key;

    /* if stateparm for assessment id is set, populate the already selected options. */
    if($stateParams.assessmentId !== undefined){
      $scope.assessmentId = $stateParams.assessmentId;
      $scope.assessmentType = $stateParams.assessmentType;
      $scope.course = $stateParams.course;
      $scope.grade = $stateParams.grade;
    }

  };

  $scope.save = function(course, assessmentType, grade){
    var ref = new Firebase("https://learn-my-stats.firebaseio.com/profile-grades/" + $scope.authData.uid + "/" + $scope.key + "/assessments");

    ref.push({
      assessmentType : assessmentType,
      grade : grade
    });

  };

  $scope.edit = function(key, assessmentId, assessmentType, grade){
    var ref = new Firebase("https://learn-my-stats.firebaseio.com/profile-grades/" + $scope.authData.uid + "/" + key + "/assessments/" + assessmentId);
    ref.update({
      assessmentType : assessmentType,
      grade : grade
    });

    navigator.notification.alert('Assessment Edited Successfully.', function(){}, "Assessment");

  };

}])

.controller('HelperCtrl',['$scope', function($scope){

  //$scope.university = "The University of the West Indies";
  //$scope.degree = "BSc. Computer Science";
  //$scope.course = "COMP2000";

  $scope.addUniversity = function(university){

    if (university.length < 3){
      navigator.notification.alert("Invalid Name", function(){}, "University")
    }
    var ref = new Firebase("https://learn-my-stats.firebaseio.com/universities");

    ref.push({
      "name" : university
    });
    if (navigator.notification && navigator.notification.alert){
      navigator.notification.alert('University Added Successfully.', function(){}, "University");
        $state.go("app.profile");
      };
    }


  $scope.addDegree = function(degree){
    var ref = new Firebase("https://learn-my-stats.firebaseio.com/degrees");

    ref.push({
      "name" : degree
    });

    navigator.notification.alert('Degree Added Successfully.', function(){}, "Degree");
    $state.go("app.profile");
  };

  $scope.addCourse = function(course){
    var ref = new Firebase("https://learn-my-stats.firebaseio.com/courses");
    /* since the course code is a unique key, do not need to use push. */
    var obj = {};
    obj[course] = true;
    ref.update(obj);

    navigator.notification.alert('Course Added Successfully.', function(){}, "Course");
    $state.go("app.profile");
  };

}]);
