var KanbanBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
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
    var issueNodes = this.props.data.filter(statusFilter).map(function (issue) {
      return (
        <Issue key={issue.id} object={issue} />
      );
    });
    return (
      <div className="panel">
        {issueNodes}
      </div>
    );
  }
});

var Issue = React.createClass({
  render: function() {
    return (
      <div className="panel callout radius">
        {this.props.object.title}
      </div>
    );
  }
});

var IssueForm = React.createClass({
  render: function() {
    return (
      <div className="issueForm">
        Hello, world! I am a IssueForm.
      </div>
    );
  }
});
React.render(
  <KanbanBox url='/api/issues' />,
  document.getElementById('kanban')
);
