import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// The RecipeDetail looks up the recipe using the id parsed from
// the URL's pathname. If no recipe is found with the given
// number, then a "recipe not found" message is displayed.
const SignUpForm = ({ onSubmit, onChange, err, user_signup, message }) => (
  <div>
    {message && <p className="success-message">{message}</p>}
    <div className="signup_form">
      <form action="/" onSubmit={onSubmit} method="POST">
        <h3>Not yet a member? Sign up here: </h3>
          {err.summary && <p className="error-message">{err.summary}</p>}
          {err.name && <p className="error-message">{err.name}</p>}
          {err.email && <p className="error-message">{err.email}</p>}
          {err.password && <p className="error-message">{err.password}</p>}
          <input type="hidden" name="_csrf" value="{{csrf}}" />
          <div className="form-group">
            <label htmlFor="fieldUsername" className="control-label">Username: </label>
            <input type="text" className="form-control" id="fieldUsername" name="name" errortext={err.name} onChange={onChange} value={user_signup.name} />
          </div>
          <div className="form-group">
            <label htmlFor="fieldEmail" className="control-label">Email: </label>
            <input type="email" className="form-control" id="fieldEmail" name="email" errortext={err.email} onChange={onChange} value={user_signup.email} />
          </div>
          <div className="form-group">
            <label htmlFor="fieldPassword" className="control-label">Password: </label>
            <input type="password" className="form-control" id="fieldPassword" name="password" errortext={err.password} onChange={onChange} value={user_signup.password} />
          </div>
          <div className="form-group">
            <div>
              <button type="submit" className="btn btn-default">Sign Up</button>
            </div>
          </div>
          <div>
            <p>Already have an account? <Link to={'/login'}>Log in</Link></p>
          </div>
      </form>
    </div>
  </div>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  err: PropTypes.object.isRequired,
  user_signup: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired
};

export default SignUpForm;
