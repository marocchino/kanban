var kanbanApp = angular.module('kanbanApp', ['ngResource']);
kanbanApp.factory('Issues', ['$resource', function($resource) {
  return $resource('/issues/:id.json', null, {
      'update': { method:'PUT' }
    });
}]);
kanbanApp.controller('KanbanCtrl', ['$scope', 'Issues', function ($scope, Issues) {
  $scope.issues = Issues.query();
  $scope.newIssue = new Issues({status: 0});
  $scope.addIssue = function () {
    if (!!$scope.newIssue.title) {
      var issues = $scope.issues;
      $scope.newIssue.$save();
      issues.push($scope.newIssue);
      $scope.newIssue = new Issues({status: 0});
      $scope.issues = issues;
    }
  };

  $scope.editIssue = function (issue) {
    $scope.currentIssue = issue;
  };

  $scope.updateIssue = function () {
    if (!!$scope.currentIssue.title) {
      Issues.update({ id: $scope.currentIssue.id }, $scope.currentIssue);
    }
  };

  $scope.moveIssue = function (id, status) {
    var issues = [];
    for (var i in $scope.issues) {
      var issue = $scope.issues[i];
      if (issue.id === id) {
        issue.status = status;
        Issues.update({ id:id }, issue);
      }
      issues.push(issue);
    }
    $scope.issues = issues;
  };

  $scope.showIssue = function (issue, status) {
    return issue.status == status;
  };
}]);
kanbanApp.directive('kanbanSortable', function() {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        var dropCallback = function ($item, targetContainer, _super) {
          var $scope = angular.element('[ng-controller=KanbanCtrl]').scope();
          var id = $item.data('id');
          var status = targetContainer.el.data('status');
          $scope.moveIssue(id, status);
          $item.removeClass("dragged").removeAttr("style");
          $("body").removeClass("dragging");
        };

        $(element).sortable({
          group: 'kanban',
          pullPlaceholder: true,
          onDrop: dropCallback
        });
      }
    };
  });
