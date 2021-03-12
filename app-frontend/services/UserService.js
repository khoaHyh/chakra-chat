export const getAllUsers = async () => {
  const response = await fetch("/api/users");
  return await response.json();
};

export const createUser = async (data) => {
  const response = await fetch(`/api/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: data }),
  });
  return await response.json();
};
