# frozen_string_literal: true
require 'test_helper'

class RotatorTest < ActiveSupport::TestCase
  def test_rotated_priorities_before
    assert_equal([1, 2, 4, 3], rotate(4, 3, 'before'))
    assert_equal([1, 3, 4, 2], rotate(4, 2, 'before'))
    assert_equal([2, 3, 4, 1], rotate(4, 1, 'before'))

    assert_equal([1, 2, 3, 4], rotate(3, 4, 'before'))
    assert_equal([1, 3, 2, 4], rotate(3, 2, 'before'))
    assert_equal([2, 3, 1, 4], rotate(3, 1, 'before'))

    assert_equal([1, 3, 2, 4], rotate(2, 4, 'before'))
    assert_equal([1, 2, 3, 4], rotate(2, 3, 'before'))
    assert_equal([2, 1, 3, 4], rotate(2, 1, 'before'))

    assert_equal([3, 1, 2, 4], rotate(1, 4, 'before'))
    assert_equal([2, 1, 3, 4], rotate(1, 3, 'before'))
    assert_equal([1, 2, 3, 4], rotate(1, 2, 'before'))
  end

  def test_rotated_priorities_after
    assert_equal([1, 2, 3, 4], rotate(4, 3, 'after'))
    assert_equal([1, 2, 4, 3], rotate(4, 2, 'after'))
    assert_equal([1, 3, 4, 2], rotate(4, 1, 'after'))

    assert_equal([1, 2, 4, 3], rotate(3, 4, 'after'))
    assert_equal([1, 2, 3, 4], rotate(3, 2, 'after'))
    assert_equal([1, 3, 2, 4], rotate(3, 1, 'after'))

    assert_equal([1, 4, 2, 3], rotate(2, 4, 'after'))
    assert_equal([1, 3, 2, 4], rotate(2, 3, 'after'))
    assert_equal([1, 2, 3, 4], rotate(2, 1, 'after'))

    assert_equal([4, 1, 2, 3], rotate(1, 4, 'after'))
    assert_equal([3, 1, 2, 4], rotate(1, 3, 'after'))
    assert_equal([2, 1, 3, 4], rotate(1, 2, 'after'))
  end

  private

  def rotate(current, target, placement)
    issues = (1..4).map { |i| Issue.new(priority: i) }
    issue = Issue.new(priority: current, status: 'todo')
    Issue.stub(:ordered_status, issues) do
      Rotator.new(issue, target, placement).rotated_priorities
    end
  end
end
