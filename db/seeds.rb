# frozen_string_literal: true
[
  'Buy sake',
  'Bush my teeth',
  'Read a book',
  'Translate some docs'
].each do |title|
  Issue.create(title: title)
end
