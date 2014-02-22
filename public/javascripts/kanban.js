$(function  () {
  $(".kanban ul").sortable({
    group: 'kanban',
    onDrop: function  ($item, targetContainer, _super) {
      console.log($item.data('id') + targetContainer.el.data('state'));
      $item.removeClass("dragged").removeAttr("style");
      $("body").removeClass("dragging");
    }
  });
});
