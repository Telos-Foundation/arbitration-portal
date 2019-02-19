import React, { Component }            from 'react';

import { Button, Collapse, Jumbotron } from 'reactstrap';

class BlockConsole extends Component {

    constructor (props) {
        super(props);

        this.state = {
            collapse: false
        };

        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    toggleCollapse() {
        this.setState({ collapse: !this.state.collapse });
    }

    render() {
        return (
            <div>
                <Button className='collapseButton' color='primary' onClick={this.toggleCollapse}>Console Output</Button>
                <Collapse isOpen={this.state.collapse}>
                    <Jumbotron className='jumbo'>
                        <p>Members Console Output Coming Soon...</p>
                    </Jumbotron>
                </Collapse>
            </div>
        )
    }

}

export default BlockConsole;