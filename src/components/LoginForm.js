import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const LoginForm = ({ onSubmit, onChange, successMessage, errors, user_login }) => (
    <div className="login_form">
        <form action="/" onSubmit={onSubmit}>
            <h2>Login to your account: </h2>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errors.summary && <p className="error-message">{errors.summary}</p>}
            <input type="hidden" name="_csrf" value="{{csrf}}" />
            <div className="form-group">
                <label htmlFor="fieldUsername" className="control-label">Username: </label>
                <input type="text" className="form-control" id="fieldUsername" name="login_name" errortext={errors.login_name} onChange={onChange} value={user_login.login_name} />
            </div>
            <div className="form-group">
                <label htmlFor="fieldPassword" className="control-label">Password: </label>
                    <input type="password" className="form-control" id="fieldPassword" name="login_password" onChange={onChange} errortext={errors.login_password} value={user_login.login_password} />
            </div>
            <div className="form-group">
                <div>
                    <button type="submit" className="btn btn-default">Log In</button>
                </div>
            </div>
            <div>
                <p>Not yet a member? <Link to={'/signup'}>Sign Up</Link></p>
            </div>
        </form>
    </div>
);

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  successMessage: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  user_login: PropTypes.object.isRequired
};

export default LoginForm;