# frozen_string_literal: true
class Issue < ActiveRecord::Base
  enum status: { todo: 0, doing: 1, done: 2 }
  validates :priority, uniqueness: { scope: :status }
  before_create :set_next_priority
  scope :status, -> (status) { where(status: statuses[status]) }

  def set_next_priority
    self.priority = Issue.status(status).maximum(:priority).to_i + 1
    self
  end
end
