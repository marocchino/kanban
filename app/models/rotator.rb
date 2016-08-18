# frozen_string_literal: true
class Rotator
  attr_reader :current, :target, :placement, :status

  def self.rotate(issue, params)
    target_priority, placement, status =
      params.values_at(:target_priority, :placement, :status)
    issue.status = status
    issue.set_next_priority! if issue.changed.include?('status')
    new(issue, target_priority, placement).save if target_priority
  end

  def initialize(issue, target, placement)
    @current = issue.priority
    @status = issue.status
    @target = target.to_i
    @placement = placement
  end

  def rotated_priorities
    return priorities if expect == current
    priorities.map do |i|
      case i
      when current then expect
      when range   then current > expect ? i + 1 : i - 1
      else i
      end
    end
  end

  def save
    return true if issues.count < 2 || rotated_priorities == priorities
    issues.zip(rotated_priorities).all? do |issue, priority|
      issue.update_attribute(:priority, priority)
    end
  end

  private

  def priorities
    [*1..issues.size]
  end

  def issues
    @issues ||= Issue.ordered_status(status)
  end

  def expect
    return current > target ? target : target - 1 if before?
    current < target ? target : target + 1
  end

  def before?
    placement == 'before'
  end

  def after?
    placement == 'after'
  end

  def range
    current > expect ? expect..current : current..expect
  end
end
