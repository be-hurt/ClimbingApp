import React from 'react';
import PropTypes from 'prop-types';

const CommentForm = ({ onSubmit, onChange, successMessage, errors, commentData}) => (
    <div className="comment-form">
        <form action="/" onSubmit={onSubmit}>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errors.summary && <p className="error-message">{errors.summary}</p>}
            <input type="hidden" name="_csrf" value="{{csrf}}" />
            <div className="form-group">
                <label htmlFor="fieldComment" className="control-label"><h2>Submit a Comment: </h2></label>
                <textarea rows="8" cols="40" className="form-control" id="fieldComment" name="comment" errortext={errors.comment} onChange={onChange} value={commentData.comment} />
            </div>
            <div className="form-group">
                <div>
                    <button type="submit" className="btn btn-default">Add Comment</button>
                </div>
            </div>
        </form>
    </div>
);

CommentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  successMessage: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  commentData: PropTypes.object.isRequired
};

export default CommentForm;