const users = [];

export const getAllUsers = (req, res) => {
  res.json(users);
};

export const createUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  const newUser = { email, password };
  users.push(newUser);
  
  res.status(201).json({ message: 'User registered successfully', user: newUser });
};