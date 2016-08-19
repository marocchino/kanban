# frozen_string_literal: true
class Issue < ApplicationRecord
  enum status: { todo: 0, doing: 1, done: 2 }
  validates :priority, uniqueness: { scope: :status }
  before_create :set_next_priority
  scope :ordered_status, -> (s) { where(status: statuses[s]).order(:priority) }

  def set_next_priority
    priority = Issue.ordered_status(status).maximum(:priority) || 0
    self.priority = priority + 1
    self
  end

  def set_next_priority!
    set_next_priority
    save
  end
end
