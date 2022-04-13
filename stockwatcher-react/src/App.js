import React from "react"
import Overview from "./components/Overview"
import HistoricalData from "./components/HistoricalData"
import News from "./components/News"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import Route from "./components/Route"
import User from "./components/User"
import Watchlist from "./components/Watchlist"
import SearchRow from "./components/SearchRow"
import ContactForm from "./components/ContactForm"
import "./CSS/App.css"

class App extends React.Component {

  state = { contactOpen: false }

  setContactOpen = (val) => {
    this.setState({ contactOpen: val })
  }

  render() {
    const param = window.location.pathname.split("/")[1];
    const currentStock = param === "watchlist" || param === "user" ? null : param
    return (
      <React.Fragment>
        <Sidebar />
        <main>
          <SearchRow setContactOpen={this.setContactOpen} />
          <div className="ui container">
            {currentStock ? <Header /> : null}
            <Route path={`/${currentStock}/overview`}>
              <Overview stock={currentStock} />
            </Route>
            <Route path={`/${currentStock}/historical-data`}>
              <HistoricalData stock={currentStock} />
            </Route>
            <Route path={`/${currentStock}/news`}>
              <News stock={currentStock} />
            </Route>
            <Route path="/watchlist">
              <Watchlist />
            </Route>
            <Route path="/user">
              <User />
            </Route>
            {this.state.contactOpen ? <ContactForm setContactOpen={this.setContactOpen} /> : null}
          </div>
        </main>
      </React.Fragment>)
  }
}

export default App