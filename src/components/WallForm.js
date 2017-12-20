import React from 'react';
import PropTypes from 'prop-types';

const WallForm = ({ onSubmit, onChange, successMessage, errors, wallInfo }) => (
    <div className="wall_form">
        <form action="/" onSubmit={onSubmit} enctype="multipart/form-data">
            <h2>Submit a new Wall: </h2>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errors.summary && <p className="error-message">{errors.summary}</p>}
            <input type="hidden" name="_csrf" value="{{csrf}}" />
            <div className="form-group">
                <label htmlFor="fieldName" className="control-label">Wall name: </label>
                <input type="text" className="form-control" id="fieldName" name="name" errortext={errors.name} onChange={onChange} value={wallInfo.name} />
            </div>
            <div className="form-group">
                <label htmlFor="fieldDifficulty" className="control-label">Difficulty: </label>
                    <input type="number" className="form-control" id="fieldDifficulty" name="difficulty" onChange={onChange} errortext={errors.difficulty} value={wallInfo.difficulty} />
            </div>
            <div className="form-group">
                <label htmlFor="fieldDescription" className="control-label">Description: </label>
                    <input type="textarea" className="form-control" id="fieldDescription" name="description" onChange={onChange} errortext={errors.description} value={wallInfo.description} />
            </div>
            <div className="form-group">
                <label htmlFor="fieldImage" className="control-label">Image: </label>
                    <input type="file" className="form-control" required accept="image/*" id="fieldImage" name="image" errortext={errors.image} value={wallInfo.image} />
            </div>
            <div className="form-group">
                <div>
                    <button type="submit" className="btn btn-default">Submit</button>
                </div>
            </div>
        </form>
    </div>
);

WallForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  successMessage: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  wallInfo: PropTypes.object.isRequired
};

export default WallForm;