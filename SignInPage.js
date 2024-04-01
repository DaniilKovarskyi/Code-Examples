import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { SubmissionError } from "redux-form";
import SignInForm from "../forms/SignInForm";
import { signIn } from "../../actions/auth";
import { AUTH_REQUEST_FULFILLED } from "../../constants/auth";

class SignInPage extends Component {
  render() {
    return (
      <div className="sign-in-page">
        <div className="sign-in-page__container">
          <SignInForm
            onSubmit={this.handleSubmit}
            role={this.checkPathName()}
          />
        </div>
      </div>
    );
  }

  checkPathName = () => {
    let pathName = this.props.location.pathname;
    if (pathName.indexOf("advertiser") !== -1) return "advertiser";
    else if (pathName.indexOf("publisher") !== -1) return "publisher";
    else return "admin";
  };

  handleSubmit = formData => {
    return this.props.actions
      .signIn({
        ...formData,
        role: this.checkPathName().toUpperCase()
      })
      .catch(({ response }) => {
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
          if (response.data === "Unauthorized") {
            throw new SubmissionError({
              serverError: "Invalid email or password"
            });
          }
          console.log(response.data);
        }
      });
  };
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      signIn
    },
    dispatch
  ),
  dispatch
});

export default connect(null, mapDispatchToProps)(SignInPage);
