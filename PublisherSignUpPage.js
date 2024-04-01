import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { SubmissionError } from "redux-form";
import PublisherSignUpForm from "../forms/PublisherSignUpForm";
import { signUp } from "../../actions/auth";
import { AUTH_REQUEST_FULFILLED } from "../../constants/auth";
import { PUBLISHER, MEDIA_BUYING_TEAM, PENDING } from "../../constants/user";

class PublisherSignUpPage extends Component {
  render() {
    return (
      <div className="publisher-sign-up-page">
        <div className="publisher-sign-up-page__container">
          <PublisherSignUpForm
            onSubmit={this.handleSubmit}
            initialValues={{
              publisherType: MEDIA_BUYING_TEAM
            }}
          />
        </div>
      </div>
    );
  }

  handleSubmit = formData => {
    delete formData.confirmPassword;
    formData.role = PUBLISHER;
    formData.status = PENDING;

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

export default connect(null, mapDispatchToProps)(PublisherSignUpPage);
