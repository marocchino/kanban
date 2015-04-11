var placeholder = document.createElement("li");
placeholder.className = "placeholder panel";
placeholder.innerText = "Drop here"

var KanbanBox = React.createClass({
  getInitialState: function() {
    return {data: [], current: {}, target: {}};
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
  updateIssue: function() {
    $.ajax({
      type: "POST",
      url: '/api/issues/' + this.state.current.id,
      data: {
        _method:'PUT',
        issue: { status: this.state.target.status },
        target_priority: this.state.target.priority,
        placement: this.state.placement
      },
      dataType: 'json',
      success: (function(msg) {
        $(placeholder).remove();
        this.getCurrent().show();
        this.getIssues();
      }).bind(this)
    });
  },
  // utility
  getCurrent: function() {
    return $("[data-id=" + this.state.current.id + "]");
  },
  setPlacement: function(e) {
    var placement;
    var relY = e.clientY - e.target.offsetTop;
    var height = e.target.offsetHeight / 2;
    if(relY > height) {
      e.target.parentNode.insertBefore(placeholder, e.target);
      placement = "before";
    } else if(relY < height) {
      e.target.parentNode.insertBefore(placeholder, e.target.nextElementSibling);
      placement = "after";
    }
    this.setState({
      target: {
              id: e.target.dataset.id,
          status: e.target.parentNode.dataset.status,
        priority: e.target.dataset.priority
      },
      placement: placement
    });
  },
  insertPlaceholder: function(e) {
    if(e.target.tagName == "LI" &&
       !e.target.classList.contains("placeholder")) {
      this.setPlacement(e);
    } else if(e.target.tagName == "UL" &&
              e.target.childNodes.length == 0) {
      e.target.appendChild(placeholder);
      this.setState({
        target: {
          id: null,
          status: e.target.dataset.status,
          priority: null
        },
        placement: null
      });
    }
  },
  // event
  dragStart: function(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData("text/html", e.currentTarget);
    this.setState({
      current: {
        id: e.currentTarget.dataset.id,
        status: e.currentTarget.parentNode.dataset.status
      }
    });
  },
  dragEnd: function(e) {
    // TODO Remove flick on getIssues
    // Update state here
    if (this.state.target.state != this.state.current.state ||
        this.state.current.id != this.state.target.id) {
      this.updateIssue();
    } else {
      this.getCurrent().show();
    }
  },
  dragOver: function(e) {
    e.preventDefault();
    this.getCurrent().hide();
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
          <p>placement: {this.state.placement}</p>
          <p>current: {this.state.current.id}</p>
          <p>target: {this.state.target.id}</p>
          <p>target status: {this.state.target.status}</p>
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
    var issueNodes = this.props.data.filter(function (issue) {
      return status == issue.status;
    }).sort(function(a, b) {
      return a.priority - b.priority;
    }).map((function (issue) {
      return (
        <li data-id={issue.id}
            data-priority={issue.priority}
            key={issue.id}
            draggable="true"
            onDragEnd={this._owner.dragEnd}
            onDragStart={this._owner.dragStart}
            className="panel callout radius">
            {issue.priority}. {issue.title}
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
