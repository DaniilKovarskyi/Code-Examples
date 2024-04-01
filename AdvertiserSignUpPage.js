import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { SubmissionError } from "redux-form";
import AdvertiserSignUpForm from "../forms/AdvertiserSignUpForm";
import { signUp } from "../../actions/auth";
import { AUTH_REQUEST_FULFILLED } from "../../constants/auth";
import { ADVERTISER } from "../../constants/user";

class AdvertiserSignUpPage extends Component {
  render() {
    return (
      <div className="advertiser-sign-up-page">
        <div className="advertiser-sign-up-page__container">
          <AdvertiserSignUpForm onSubmit={this.handleSubmit} />
        </div>
      </div>
    );
  }

  handleSubmit = formData => {
    delete formData.confirmPassword;
    formData.role = ADVERTISER;

    return this.props.actions.signUp(formData).catch(({ response }) => {
      this.props.dispatch({
        type: AUTH_REQUEST_FULFILLED
      });

      let errors = response.data.errors;

      if (errors) {
        const error = errors.reduce((result, { path, message }) => {
          result[path] = message;
          return result;
        }, {});
        throw new SubmissionError(error);
      } else {
        console.log(response.data);
      }
    });
  };
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      signUp
    },
    dispatch
  ),
  dispatch
});

export default connect(null, mapDispatchToProps)(AdvertiserSignUpPage);
