import { Card } from "@/components/ui/card";

const UserList = ({ users }) => {
    return(
        <Card className="p-4 h-full">
            <h3 className = "font-semibold mb-2">Online Users</h3>
            <ul className="text-sm space-y-1">
                {users.map((user) => (
                    <li key={user.id}>.{user.username}</li>
                ))}
            </ul>
        </Card>
    );
};

export default UserList;