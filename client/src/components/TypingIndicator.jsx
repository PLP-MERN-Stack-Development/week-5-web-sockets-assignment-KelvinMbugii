const TypingIndicator = ({ users }) => {
    if(!users.length) return null;

    return(
        <div className = "text-xs text-muted-foreground mt-2 italic">
            {users.join(", ")} {users.length === 1 ? "is" : "are"} typing...

        </div>
    );
};

export default TypingIndicator;