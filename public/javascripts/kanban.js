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
      $scope.newIssue.$save();
      $scope.issues.push($scope.newIssue);
      $scope.newIssue = new Issues({status: 0});
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
    for (var i in $scope.issues) {
      var issue = $scope.issues[i];
      if (issue.id === id) {
        issue.status = status;
        Issues.update({id: id}, issue);
        break;
      }
    }
  };

  $scope.deleteIssue = function (issue) {
    Issues.delete({id: issue.id}, function() {
      $scope.issues.forEach(function(currentIssue, index) {
        if (currentIssue === issue) {
          $scope.issues.splice(index, 1);
        }
      });
    });
  }

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
