class GridComponent extends React.Component {

    constructor(props) {
        super(props);
        this.loadingInidicatorEl = document.getElementById('loader');
        this.bodyEl = document.getElementsByTagName('body')[0];
        this.state = {
            dataSet: [],
            filteredData: [],
            pageNo: 1,
            searchKey: ''
        }
    }

    showLoadingIndicator() {
        this.loadingInidicatorEl.style.display = 'block';
        this.bodyEl.classList.add('bodyOverlay');
    }

    hideLoadingIndicator() {
        this.loadingInidicatorEl.style.display = 'none';
        this.bodyEl.classList.remove('bodyOverlay');
    }

    componentWillMount() {
        this.readData();
    }

    readData() {
        this.showLoadingIndicator();
        fetch("jsonData.json")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({dataSet: result});
                    this.setState({filteredData: result});
                    this.hideLoadingIndicator();
                },
                (error) => {
                    console && console.log(error);
                    this.hideLoadingIndicator();;
                }
            )
    }

    handleEnter(e) {
        if (e.keyCode === 13) {
            var val = document.getElementById('pageNoId').value;
            if(val < 1)
                val = 1;
            if(val > Math.ceil(this.state.filteredData.length/50))
                val = Math.ceil(this.state.filteredData.length/50);
            this.setState({ pageNo: val });
            document.getElementById('pageNoId').value = val;
        }
    }

    filterDataSet(e) {
        const searchQuery = e.target.value;
        this.setState({ searchKey: searchQuery });
        let dataToBeRendered = [];
        const data = this.state.dataSet;
        let dataItem;
        for(let i = 0; i < data.length; i++) {
            dataItem = data[i];
            for(let key in dataItem) {
                if(dataItem.hasOwnProperty(key) && this.hasQueryMatched(searchQuery, dataItem[key])) {
                    dataToBeRendered.push(dataItem);
                    break;
                }
            }
        }
        this.setState({filteredData: dataToBeRendered});
        this.setState({ pageNo: 1 });
        document.getElementById('pageNoId').value = 1;
    }

    hasQueryMatched(searchQuery, value) {
        return ((value+'').toLowerCase().indexOf(searchQuery) > -1);
    }

    render() {
        const { filteredData, pageNo } = this.state;
        const dataForSplice = filteredData.concat();
        let k = 0;
        return (
            <div>
                <div id="searchId">
                    <input type="text" id="searchInput" name="searchQuery" placeholder="Search" onChange={ this.filterDataSet.bind(this) } />
                    <span className={"searchIcon"}></span>
                </div>
                <div className={'grid'}>
                    <table className={"table table-bordered"}>
                        <thead className={'tableHead'}>
                        <tr>
                            <td className={"headerLabel"}>
                                <span>First Name</span>
                            </td>
                            <td className={"headerLabel"}>
                                <span>Last Name</span>
                            </td>
                            <td className={"headerLabel"}>
                                <span>Email</span>
                            </td>
                            <td className={"headerLabel"}>
                                <span>Agency Name</span>
                            </td>
                        </tr>
                        </thead>
                        <tbody>
                        {dataForSplice.splice((pageNo-1)*50,50).map(data => (<tr key={k++}><td>{data.firstname}</td><td>{(data.lastname.toLowerCase() !== 'null' ? data.lastname : '')}</td><td>{data.email}</td><td>{(data['agency_name'] && typeof data['agency_name'] === 'string' && data['agency_name'].toLowerCase() !== 'null' ? data['agency_name'] : '')}</td></tr>))}
                        </tbody>
                    </table>
                </div>
                <div id="paginationId">
                    Page <input id="pageNoId" type="number" defaultValue={pageNo} name="pageNo" onKeyDown={ this.handleEnter.bind(this)}/> of {Math.ceil(filteredData.length/50)}
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <GridComponent/>, document.getElementById('mainDivId')
);