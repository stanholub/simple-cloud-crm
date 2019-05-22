import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Spinner from "../layout/Spinner";

class Clients extends Component {
  state = {
    totalBalance: null
  };

  static getDerivedStateFromProps(props, state) {
    const { clients } = props;

    if (clients) {
      const total = clients.reduce((total, client) => {
        return total + parseFloat(client.balance.toString());
      }, 0);

      return { totalBalance: total };
    } else {
      return null;
    }
  }

  render() {
    const { clients } = this.props;
    const { totalBalance } = this.state;

    if (clients) {
      return (
        <div>
          <div className="row">
            <div className="col-md-6">
              <h2>
                {" "}
                <i className="fas fa-address-book" /> Clients
              </h2>
            </div>
            <div className="col-md-6">
              <h5 className="text-right text-secondary">
                Total balance:{" "}
                <span className="text-primary">
                  ${parseFloat(totalBalance).toFixed(2)}
                </span>
              </h5>
            </div>
          </div>

          <div className="card-columns">
            {clients.map(client => (
              <div className="card bg-light border-info" key={client.id}>
                <div className="card-body">
                  <h4 className="card-title">
                    {client.firstName} {client.lastName}{" "}
                  </h4>
                  <p className="card-text">Email: {client.email}</p>
                  <p className="card-text">
                    Balance: ${parseFloat(client.balance).toFixed(2)}
                  </p>
                  <Link
                    to={`/client/${client.id}`}
                    className="btn btn-info btn-sm"
                  >
                    <i className="far fa-file" /> Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

Clients.propTypes = {
  firestore: PropTypes.object.isRequired,
  clients: PropTypes.array
};

export default compose(
  firestoreConnect([{ collection: "clients" }]),
  connect((state, props) => ({
    clients: state.firestore.ordered.clients
  }))
)(Clients);
