require 'test_helper'

class IssueTest < ActiveSupport::TestCase
  def issue
    @issue ||= Issue.new
  end

  def test_create
    assert Issue.create(title: 'test')
  end

  def test_invalid_same_priority_in_same_category
    one = issues(:one)
    issue = Issue.new
    issue.priority = one.priority
    issue.status = one.status
    assert !issue.valid?

    issue.priority += 1
    assert issue.valid?
  end

  def test_todo_status
    assert issue.todo?
    assert_equal 'todo', issue.status
  end

  def test_doing_status
    issue = issues(:two)
    assert issue.doing?
    assert_equal 'doing', issue.status
  end

  def test_done_status
    issue = issues(:three)
    assert issue.done?
    assert_equal 'done', issue.status
  end
end
