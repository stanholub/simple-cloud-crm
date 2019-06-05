import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Spinner from "../layout/Spinner";
import classnames from "classnames";
import "../layout/style.css";

class ClientDetails extends Component {
  state = {
    showBalanceUpdate: false,
    balanceUpdateAmount: "0.00",
    topic: "",
    info: ""
  };

  onSubmit = e => {
    e.preventDefault();

    const { client, firestore } = this.props;

    const newNote = {
      info: this.state.info,
      topic: this.state.topic
    };

    firestore
      .add(
        {
          collection: "clients",
          doc: client.id,
          subcollections: [{ collection: "notes" }]
        },
        newNote
      )
      .then(() => {
        this.setState({ topic: "", info: "" });
      });
  };

  balanceSubmit = e => {
    e.preventDefault();

    const { client, firestore } = this.props;
    const { balanceUpdateAmount } = this.state;    
    
    const clientUpdate = {
      balance: parseFloat(balanceUpdateAmount)
    };   

    firestore.update({ collection: "clients", doc: client.id }, clientUpdate);
  };

  onDeleteClick = e => {
    const { client, firestore, history } = this.props;

    firestore
      .delete({ collection: "clients", doc: client.id })
      .then(history.push("/"));
  };

  onDeleteNoteClick = e => {
    const { firestore, history, client } = this.props;

    firestore.delete({
      collection: "clients",
      doc: client.id,
      subcollections: [{ collection: "notes", doc: e.target.id }]
    });
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onBalanceChange = e =>  {
    if (!isNaN(e.target.value)) {
      this.setState({ [e.target.name]: e.target.value });
    }    
  }

  render() {
    const { client, notes } = this.props;
    const { showBalanceUpdate, balanceUpdateAmount } = this.state;

    let balanceForm = "";
    if (showBalanceUpdate) {
      balanceForm = (
        <form onSubmit={this.balanceSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              name="balanceUpdateAmount"
              placeholder="Add new balance"
              minlength="1"
              maxlength="10"
              required
              value={balanceUpdateAmount}
              onChange={this.onBalanceChange}
            />
            <div className="input-group-append">
              <input
                type="submit"
                value="update"
                className="btn btn-outline-dark"
              />
            </div>
          </div>
        </form>
      );
    } else {
      balanceForm = null;
    }

    if (client && notes) {
      return (
        // Delete Client Modal
        <div>
          <div className="modal fade" id="deleteModal">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Delete</h4>
                  <button type="button" className="close" data-dismiss="modal">
                    &times;
                  </button>
                </div>

                <div className="modal-body">
                  Are you sure you want to delete this record?
                </div>

                <div className="modal-footer">
                  <button
                    onClick={this.onDeleteClick}
                    className="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Yes, remove it.
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-dismiss="modal"
                  >
                    No, let it be!
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Client Details */}
          <div className="row">
            <div className="col-md-6">
              <Link to="/" className="btn btn-link">
                <i className="fas fa-arrow-circle-left" /> Back to Dashboard
              </Link>
            </div>
            <div className="col-md-6">
              <div className="btn-group float-right">
                <Link to={`/client/edit/${client.id}`} className="btn btn-dark">
                  Edit
                </Link>

                <button
                  type="button"
                  className="btn btn-danger"
                  data-toggle="modal"
                  data-target="#deleteModal"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <hr />
          <div className="card">
            <h3 className="card-header">
              <span className="float-left">
                {client.firstName} {client.lastName}
              </span>
              <span className="float-right">
                Balance:{" "}
                <span
                  className={classnames({
                    "text-danger": client.balance > 0,
                    "text-success": client.balance === 0 || client.balance < 0
                  })}
                >
                  ${parseFloat(client.balance).toFixed(2)}{" "}
                </span>
                <small>
                  <a
                    href="#!"
                    onClick={() =>
                      this.setState({
                        showBalanceUpdate: !this.state.showBalanceUpdate
                      })
                    }
                  >
                    <i className="far fa-edit text-info" />
                  </a>
                </small>
              </span>
            </h3>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8 col-sm-6">
                  <h4>
                    Client ID:{" "}
                    <span className="text-secondary">{client.id}</span>
                  </h4>
                </div>
                <div className="col-md-4 col-sm-6">{balanceForm}</div>
              </div>
              <hr />
              <ul className="list-group">
                <li className="list-group-item">
                  <i className="fas fa-at text-info" /> {client.email}
                </li>
                <li className="list-group-item">
                  <i className="fas fa-phone text-info" /> {client.phone}
                </li>
              </ul>
            </div>
          </div>
          <hr />

          {/* Add Note */}
          <div>
            <div className="modal fade" id="addNoteModal">
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Add Note</h4>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                    >
                      &times;
                    </button>
                  </div>
                  <form onSubmit={this.onSubmit}>
                    <div className="modal-body">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          name="topic"
                          placeholder="Topic"
                          minLength="2"
                          required
                          onChange={this.onChange}
                          value={this.state.topic}
                        />
                        <hr />
                        <textarea
                          type="text"
                          className="form-control"
                          name="info"
                          placeholder="Note body"
                          minLength="2"
                          rows="5"
                          required
                          onChange={this.onChange}
                          value={this.state.info}
                        />
                      </div>
                    </div>
                  </form>
                  <div className="modal-footer">
                    <button
                      onClick={this.onSubmit}
                      className="btn btn-success"
                      data-dismiss="modal"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Client Notes */}
            <div className="card">
              <div className="card-header">
                <h3 className="float-left">Notes</h3>
                <button
                  type="button"
                  className="btn btn-success float-right"
                  data-toggle="modal"
                  data-target="#addNoteModal"
                >
                  Add Note
                </button>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {notes.map(note => (
                    <li
                      key={note.id}
                      onClick={this.onDeleteNoteClick}
                      className="list-group-item"
                    >
                      <span className="text-info">{note.topic}</span>
                      {" | "}
                      {note.info}
                      <i
                        id={note.id}
                        className="fas fa-trash-alt float-right text-secondary"
                        style={{}}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

ClientDetails.propTypes = {
  firestore: PropTypes.object.isRequired
};

export default compose(
  firestoreConnect(props => [
    {
      collection: "clients",
      storeAs: "client",
      doc: props.match.params.id
    },
    {
      collection: "clients",
      storeAs: "notes",
      doc: props.match.params.id,
      subcollections: [
        {
          collection: "notes"
        }
      ]
    }
  ]),
  connect(({ firestore: { ordered } }, props) => ({
    client: ordered.client && ordered.client[0],
    notes: ordered.notes
  }))
)(ClientDetails);
