var placeholder = document.createElement("li");
placeholder.className = "placeholder panel";
placeholder.innerText = "Drop here"

var KanbanBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  // api call
  getIssues: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data.issues});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  reorderIssue: function(){
    console.log("reorderIssue:");
    console.log("  id: " + this.dragged.dataset.id);
    console.log("  targetId: " + this.over.dataset.id);
    console.log("  placement: " + this.nodePlacement);
    this.getIssues();
  },
  setStatusOfIssue: function() {
    $.ajax({
      type: "POST",
      url: '/api/issues/' + this.dragged.dataset.id,
      data: {
        _method:'PUT',
        issue: { status: this.targetList.dataset.status }
      },
      dataType: 'json',
      success: (function(msg) {
        if(this.over) {
          this.reorderIssue();
        } else {
          this.getIssues();
        }
      }).bind(this)
    });
  },
  // utility
  setNodePlacement: function(e) {
    var relY = e.clientY - this.over.offsetTop;
    var height = this.over.offsetHeight / 2;
    if(relY > height) {
      this.nodePlacement = "after";
    } else if(relY < height) {
      this.nodePlacement = "before";
    }
  },
  insertPlaceholder: function(e) {
    if(e.target.tagName == "LI" &&
       !e.target.classList.contains("placeholder")) {
      this.over = e.target;
      this.setNodePlacement(e);
      this.targetList = this.over.parentNode;
      if(this.nodePlacement == "before") {
        this.targetList.insertBefore(placeholder, this.over.nextElementSibling);
      } else {
        this.targetList.insertBefore(placeholder, this.over);
      }
    } else if(e.target.tagName == "UL" &&
              e.target.childNodes.length == 0) {
      this.over = null;
      this.targetList = e.target;
      e.target.appendChild(placeholder);
    }
  },
  // event
  dragStart: function(e) {
    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData("text/html", e.currentTarget);
  },
  dragEnd: function(e) {
    var originList = this.dragged.parentNode;
    this.targetList.removeChild(placeholder);

    // Update state here
    if (this.dragged.dataset.id == this.over.dataset.id) {
      this.dragged.style.display = "block";
    } else if (this.targetList != originList) {
      this.setStatusOfIssue();
    } else {
      this.reorderIssue();
      this.dragged.style.display = "block";
    }
  },
  dragOver: function(e) {
    e.preventDefault();
    this.dragged.style.display = "none";
    this.insertPlaceholder(e);
  },
  componentDidMount: function() {
    this.getIssues();
  },
  render: function() {
    return (
      <div className="row">
        <div className="large-4 columns">
          <h3>TODO</h3>
          <IssueList data={this.state.data} status='todo' />
          <IssueForm />
        </div>
        <div className="large-4 columns">
          <h3>DOING</h3>
          <IssueList data={this.state.data} status='doing' />
        </div>
        <div className="large-4 columns">
          <h3>DONE</h3>
          <IssueList data={this.state.data} status='done' />
        </div>
      </div>
    );
  }
});
var IssueList = React.createClass({
  render: function() {
    var status = this.props.status;
    var statusFilter = function (issue) {
      return status == issue.status;
    };
    var issueNodes = this.props.data.filter(statusFilter).map((function (issue) {
      return (
        <li data-id={issue.id}
            key={issue.id}
            draggable="true"
            onDragEnd={this._owner.dragEnd}
            onDragStart={this._owner.dragStart}
            className="panel callout radius">
          {issue.title}
        </li>
      );
    }).bind(this));
    return (
      <ul className="panel issues"
          data-status={status}
          onDragOver={this._owner.dragOver}>
        {issueNodes}
      </ul>
    );
  }
});

var IssueForm = React.createClass({
  render: function() {
    return (
      <div className="issueForm">
        Hello! I am a IssueForm.
      </div>
    );
  }
});

React.render(
  <KanbanBox url='/api/issues' />,
  document.getElementById('kanban')
);
