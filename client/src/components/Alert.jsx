const Alert = ({ type = 'error', message }) => {
    if (!message) return null;

    return (
        <div className={`alert-box ${type}`}>
            {message}
        </div>
    );
};

export default Alert;