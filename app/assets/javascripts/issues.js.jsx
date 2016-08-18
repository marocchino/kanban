let placeholder = document.createElement("li")
placeholder.className = "placeholder panel callout"
placeholder.innerText = "Drop here"

class KanbanBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {data: [], currentId: 0, target: {}}

    this.dragStart = this.dragStart.bind(this)
    this.dragEnd = this.dragEnd.bind(this)
    this.dragOver = this.dragOver.bind(this)
  }

  componentDidMount() {
    this.getIssues()
  }

  // api call
  getIssues() {
    const url = this.props.url
    $.ajax({
      url,
      dataType: 'json',
      success: (res) => {
        this.setState({data: res.data})
      },
      error: (xhr, status, err) => {
        console.error(url, status, err.toString())
      }
    })
  }

  updateIssue() {
    $.ajax({
      type: "POST",
      url: `/api/issues/${this.state.currentId}`,
      data: {
        _method:'PUT',
        status: this.state.target.status,
        target_priority: +this.state.target.priority,
        placement: this.state.placement
      },
      dataType: 'json',
      success: (msg) => {
        this.getIssues()
        this.setState({ currentId: 0 })
      }
    })
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
    } else {
      const ul = e.target.querySelector('ul')
      if (!ul) {
        return
      }
      ul.appendChild(placeholder)
      this.setState({
        target: {
          id: null,
          status: ul.dataset.status,
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
    this.setState({ currentId: +e.currentTarget.dataset.id })
  }

  dragEnd(e) {
    // TODO Remove flick on getIssues
    // Update state here
    $(placeholder).remove()
    if (this.state.currentId !== this.state.target.id) {
      this.updateIssue()
    }
  }

  dragOver(e) {
    e.preventDefault()
    this.insertPlaceholder(e)
  }

  render() {
    return (
      <div>
        <div className="row">
          <IssueForm />
          <p>placement: {this.state.placement}</p>
          <p>currentId: {this.state.currentId}</p>
          <p>target: {this.state.target.id}</p>
          <p>target status: {this.state.target.status}</p>
        </div>
        <div className="row">
          <IssueList
            data={this.state.data}
            currentId={this.state.currentId}
            dragEnd={this.dragEnd}
            dragStart={this.dragStart}
            dragOver={this.dragOver}
            status='todo'
          />
          <IssueList
            data={this.state.data}
            currentId={this.state.currentId}
            dragEnd={this.dragEnd}
            dragStart={this.dragStart}
            dragOver={this.dragOver}
            status='doing'
          />
          <IssueList
            data={this.state.data}
            currentId={this.state.currentId}
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
    return data.filter((issue) => status === issue.attributes.status)
  }

  render() {
    const { status, dragEnd, dragStart, dragOver, data, currentId } = this.props
    const issueNodes = this._issueNodes(status, data)
    return (
      <div
        className="large-4 columns"
        onDragOver={dragOver}>
        <h3>{status}</h3>
        <ul
          className="panel issues"
          data-status={status}>
          {issueNodes.map((issue) => (
            <IssueItem
              id={+issue.id}
              currentId={currentId}
              key={+issue.id}
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
  currentId: React.PropTypes.number,
  dragEnd: React.PropTypes.func.isRequired,
  dragOver: React.PropTypes.func.isRequired,
  dragStart: React.PropTypes.func.isRequired,
  status: React.PropTypes.string.isRequired
}

class IssueItem extends React.Component {
  render() {
    const { id, currentId, title, priority, dragStart, dragEnd } = this.props
    const className = "panel callout radius"
    return (
      <li
        data-id={id}
        draggable="true"
        data-priority={priority}
        onDragEnd={dragEnd}
        onDragStart={dragStart}
        className={className}>
        {id}. {title}. ({priority})
      </li>
    )
  }
}

IssueItem.propTypes = {
  id: React.PropTypes.number.isRequired,
  currentId: React.PropTypes.number,
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
