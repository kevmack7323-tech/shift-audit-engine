-- Insert mock users for role-based testing
INSERT INTO users (username, role, password_hash) VALUES
('operator_mike', 'Staff', 'hashed_pw_123'),
('supervisor_sarah', 'Supervisor', 'hashed_pw_456'),
('manager_david', 'Manager', 'hashed_pw_789');

-- Insert initial active shift
INSERT INTO shifts (user_id, status) VALUES (1, 'Active');

-- Insert shift checklist tasks
INSERT INTO checklist_items (shift_id, task_name, completed, notes) VALUES
(1, 'Perimeter access control check', TRUE, 'All gates secured.'),
(1, 'Logistics inventory intake audit', FALSE, 'Pending delivery truck arrival.'),
(1, 'System security logs review', FALSE, 'To be completed mid-shift.');