import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// The RecipeDetail looks up the recipe using the id parsed from
// the URL's pathname. If no recipe is found with the given
// number, then a "recipe not found" message is displayed.
const SignUpForm = ({ onSubmit, onChange, err, user_signup, successMessage }) => (
  <div className="signup_form">
    <form action="/" onSubmit={onSubmit} method="POST">
      <h3>Not yet a member? Sign up here: </h3>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {err.summary && <p className="error-message">{err.summary}</p>}
        <input type="hidden" name="_csrf" value="{{csrf}}" />
        <div className="form-group">
          <label htmlFor="fieldUsername" className="control-label">Username: </label>
          <input type="text" className="form-control" required id="fieldUsername" name="name" errortext={err.name} onChange={onChange} value={user_signup.name} />
        </div>
        <div className="form-group">
          <label htmlFor="fieldEmail" className="control-label">Email: </label>
          <input type="email" className="form-control" required id="fieldEmail" name="email" errortext={err.email} onChange={onChange} value={user_signup.email} />
        </div>
        <div className="form-group">
          <label htmlFor="fieldPassword" className="control-label">Password: </label>
          <input type="password" className="form-control" required id="fieldPassword" name="password" errortext={err.password} onChange={onChange} value={user_signup.password} />
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
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  err: PropTypes.object.isRequired,
  user_signup: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
};

export default SignUpForm;
