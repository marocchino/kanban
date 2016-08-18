let placeholder = document.createElement("li")
placeholder.className = "placeholder panel callout"
placeholder.innerText = "Drop here"

class KanbanBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {data: [], current: {}, target: {}}

    this.dragStart = this.dragStart.bind(this)
    this.dragEnd = this.dragEnd.bind(this)
    this.dragOver = this.dragOver.bind(this)
  }

  componentDidMount() {
    this.getIssues()
  }

  // api call
  getIssues() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(res) {
        this.setState({data: res.data})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    })
  }

  updateIssue() {
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
        $(placeholder).remove()
        this.getCurrent().show()
        this.getIssues()
      }).bind(this)
    })
  }

  // utility
  getCurrent() {
    return $("[data-id=" + this.state.current.id + "]")
  }

  setPlacement(e) {
    let placement
    let relY = e.clientY - e.target.offsetTop
    let height = e.target.offsetHeight / 2
    if(relY > height) {
      e.target.parentNode.insertBefore(placeholder, e.target)
      placement = "before"
    } else if(relY < height) {
      e.target.parentNode.insertBefore(placeholder, e.target.nextElementSibling)
      placement = "after"
    }
    this.setState({
      target: {
              id: e.target.dataset.id,
          status: e.target.parentNode.dataset.status,
        priority: e.target.dataset.priority
      },
      placement: placement
    })
  }

  insertPlaceholder(e) {
    if(e.target.tagName == "LI" &&
       !e.target.classList.contains("placeholder")) {
      this.setPlacement(e)
    } else if(e.target.tagName == "UL" &&
              e.target.childNodes.length == 0) {
      e.target.appendChild(placeholder)
      this.setState({
        target: {
          id: null,
          status: e.target.dataset.status,
          priority: null
        },
        placement: null
      })
    }
  }

  // event
  dragStart(e) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData("text/html", e.currentTarget)
    this.setState({
      current: {
        id: e.currentTarget.dataset.id,
        status: e.currentTarget.parentNode.dataset.status
      }
    })
  }

  dragEnd(e) {
    // TODO Remove flick on getIssues
    // Update state here
    if (this.state.target.state != this.state.current.state ||
        this.state.current.id != this.state.target.id) {
      this.updateIssue()
    } else {
      this.getCurrent().show()
    }
  }

  dragOver(e) {
    e.preventDefault()
    this.getCurrent().hide()
    this.insertPlaceholder(e)
  }

  render() {
    return (
      <div>
        <div className="row">
          <IssueForm />
          <p>placement: {this.state.placement}</p>
          <p>current: {this.state.current.id}</p>
          <p>target: {this.state.target.id}</p>
          <p>target status: {this.state.target.status}</p>
        </div>
        <div className="row">
          <IssueList
            data={this.state.data}
            dragEnd={this.dragEnd}
            dragStart={this.dragStart}
            dragOver={this.dragOver}
            status='todo'
          />
          <IssueList
            data={this.state.data}
            dragEnd={this.dragEnd}
            dragStart={this.dragStart}
            dragOver={this.dragOver}
            status='doing'
          />
          <IssueList
            data={this.state.data}
            dragEnd={this.dragEnd}
            dragStart={this.dragStart}
            dragOver={this.dragOver}
            status='done'
          />
        </div>
      </div>
    )
  }
}

KanbanBox.propTypes = {
  url: React.PropTypes.string.isRequired
}

class IssueList extends React.Component {
  _issueNodes(status, data) {
    return data
      .filter((issue) => status == issue.attributes.status)
      .sort((a, b) => a.priority - b.priority)
  }

  render() {
    const { status, dragEnd, dragStart, data } = this.props
    const issueNodes = this._issueNodes(status, data)
    return (
      <div className="large-4 columns">
        <h3>{status}</h3>
        <ul
          className="panel issues"
          data-status={status}
          onDragOver={this.props.dragOver}>
          {issueNodes.map((issue) => (
            <IssueItem
              id={issue.id}
              key={issue.id}
              priority={issue.attributes.priority}
              title={issue.attributes.title}
              dragEnd={dragEnd}
              dragStart={dragStart}
            />
          ))}
        </ul>
      </div>
    )
  }
}
IssueList.propTypes = {
  data: React.PropTypes.array.isRequired,
  dragEnd: React.PropTypes.func.isRequired,
  dragOver: React.PropTypes.func.isRequired,
  dragStart: React.PropTypes.func.isRequired,
  status: React.PropTypes.string.isRequired
}

class IssueItem extends React.Component {
  render() {
    return (
      <li
        data-id={this.props.id}
        data-priority={this.props.priority}
        draggable="true"
        onDragEnd={this.props.dragEnd}
        onDragStart={this.props.dragStart}
        className="panel callout radius">
        {this.props.priority}. {this.props.title}
      </li>
    )
  }
}

IssueItem.propTypes = {
  id: React.PropTypes.number.isRequired,
  key: React.PropTypes.number.isRequired,
  priority: React.PropTypes.number.isRequired,
  title: React.PropTypes.string.isRequired,
  dragEnd: React.PropTypes.func.isRequired,
  dragStart: React.PropTypes.func.isRequired
}

class IssueForm extends React.Component {
  render() {
    return (
      <div className="issueForm">
        Hello! I am a IssueForm.
      </div>
    )
  }
}

ReactDOM.render(
  <KanbanBox url='/api/issues' />,
  document.getElementById('kanban')
)
