import { useState } from "react";
import { validateCredentials } from "../api/greenApi";

function LoginForm({ onLogin }) {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsValidating(true);

    try {
      const isValid = await validateCredentials(idInstance, apiTokenInstance);
      if (isValid) {
        onLogin(idInstance, apiTokenInstance);
      } else {
        setError(
          "Invalid credentials. Please check your idInstance and apiTokenInstance."
        );
      }
    } catch (err) {
      setError("Failed to validate credentials. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="login-form">
      <h2>Login with GREEN-API</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="idInstance"
            value={idInstance}
            onChange={(e) => {
              setIdInstance(e.target.value);
              setError("");
            }}
            required
            disabled={isValidating}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="apiTokenInstance"
            value={apiTokenInstance}
            onChange={(e) => {
              setApiTokenInstance(e.target.value);
              setError("");
            }}
            required
            disabled={isValidating}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button
          type="submit"
          disabled={isValidating || !idInstance || !apiTokenInstance}
        >
          {isValidating ? "Validating..." : "Connect"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
