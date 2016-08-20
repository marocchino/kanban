# frozen_string_literal: true
require 'test_helper'

class IssueTest < ActiveSupport::TestCase
  def setup
    @one = issues(:one)
    @issue = Issue.new(status: @one.status)
  end

  def test_invalid_same_priority_in_same_category
    @issue.priority = @one.priority
    refute @issue.valid?

    @issue.priority += 1
    assert @issue.valid?
  end

  def test_set_next_priority
    @issue.status = @one.status
    assert_kind_of Issue, @issue.set_next_priority
    assert_equal @one.priority + 1, @issue.priority
    @one.destroy
    @issue.set_next_priority
    assert_equal 1, @issue.priority
  end
end
