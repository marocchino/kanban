# frozen_string_literal: true
class IssueSerializer < ActiveModel::Serializer
  attributes :id, :title, :status, :priority
end
