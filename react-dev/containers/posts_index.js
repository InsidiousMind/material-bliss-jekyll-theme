import React, { Component } from 'react';

import { connect } from 'react-redux';

import _ from 'lodash';

import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';


import { fetchPosts, fetchSiteInfo } from '../actions/index';

class PostsIndex extends Component {

  componentWillMount() {
    this.props.fetchPosts();
    this.props.fetchSiteInfo();
  }

  getReadTime(post) {
    const count = post.body.split(' ').length;
    const readingTime = (count / 233).toFixed(1);
    return `Reading time ${readingTime} min. Word count: ${count}`;
  }

  getDate(dateString) {
    const date = new Date(dateString.split(' ')[0]);
    return date.toDateString();
  }

  getCategories(categories) {
    return categories.map((cat) => `${cat} `);
  }

  styles = {
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
      textAlign: 'left',
    },
    chip: {
      margin: 4,
    }
  };

  createMarkup(post) {
    let body = post.body.split(' ');
    body = body.slice(1, 50);
    body = body.join(' ');
    return `${body}...`;
  }

  renderChips(data) {
    return data.map((tag) => (<Chip key={tag} style={this.styles.chip}>
        {tag}
      </Chip>
    ));
  }
  renderPosts() {
    if (_.isEmpty(this.props.posts)) {
      return <li> No Results </li>;
    }
    return _.reverse(this.props.posts.map((post) => {
      const postLink = `${this.props.siteInfo.url}${post.url}`;
      return (
        <Paper key={post.title} zDepth={4} className="paper-wrapper" >
          <li key={post.title}>

              <a href={postLink}><strong><h2>{post.title}</h2></strong></a>

              <div className="post-meta">
                <ul>
                  <li>
                    <time>{this.getDate(post.meta.date)}</time>
                  </li>
                  <li className='divider'>/</li>
                  <li>{this.getCategories(post.meta.categories)}</li>
                  <li className='divider'>/</li>
                  <li>{this.getReadTime(post)}</li>
                </ul>
              </div>

              <p>{this.createMarkup(post)}</p>

              <div className="div-container">
                <a href={postLink} >
                  <RaisedButton
                    label="Read More"
                    labelPosition="before"
                    secondary
                    icon={<FontIcon className="material-icons">&#xE037;</FontIcon>}
                    className="raised-button-override"
                  />
                </a>
            </div>

            <div style={this.styles.wrapper}>
              {this.renderChips(post.meta.tags)}
            </div>

          </li>
        </Paper>
      );
    }));
  }

  render() {
    return (
      <div>
        <ul>
          {this.renderPosts()}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    posts: state.posts.all,
    siteInfo: state.siteInfo.all
  };
}

export default connect(mapStateToProps, { fetchPosts, fetchSiteInfo })(PostsIndex);
