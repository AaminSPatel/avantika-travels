# Admin Dashboard Implementation TODO

## Backend Updates
- [x] Add status field to Package model
- [x] Add status field to Contact model
- [x] Add status field to Review model
- [ ] Update backend routes to support new status fields and CRUD for contacts/reviews

## Context Updates
- [x] Add contacts and reviews state to context
- [x] Add CRUD functions for contacts and reviews
- [x] Add toggle status functions for all entities

## Frontend Admin Panel
- [ ] Create admin login page (/admin/login)
- [x] Create admin dashboard layout with sidebar navigation (added toggle for small screens)
- [ ] Implement authentication logic (token storage, protected routes)
- [ ] Create admin pages for each entity:
  - [x] Packages page (/admin/packages)
  - [x] Places page (/admin/places) - with predefined categories
  - [ ] Blogs page (/admin/blogs)
  - [ ] Contacts page (/admin/contacts)
  - [ ] Reviews page (/admin/reviews)
- [ ] For each admin page, implement:
  - [ ] Grid view
  - [ ] Table view toggle
  - [ ] Create form
  - [ ] Update form with image change/remove
  - [ ] Delete functionality
  - [ ] View details modal
  - [ ] Edit functionality
  - [ ] Toggle status buttons
- [ ] Make all admin pages responsive for mobile
- [ ] Apply consistent color theme and styling

## Place Categories
- [ ] Define 6 predefined categories for places:
  - Temple
  - Darshan
  - Historical Site
  - Nature Spot
  - Cultural Center
  - Pilgrimage Site
