import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Progress,
  Row,
  Table,
} from 'reactstrap';
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import {getStyle, hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities'
import {countriesAr, iso2} from "../../util/countries";
import axios from 'axios';
// import moment from 'moment';
import zoom from 'chartjs-plugin-zoom'

const brandPrimary = getStyle('--primary');
const brandSuccess = getStyle('--success');
const brandInfo = getStyle('--info');
const brandWarning = getStyle('--warning');
const brandDanger = getStyle('--danger');

const alertStyle = {
  'position': 'fixed',
  'left': 0,
  'zIndex': 9999,
  'bottom': 0
};

class Dashboard extends Component {
  componentDidMount() {
    // update every certain time
    setInterval(() => {
      console.log('Updating stats');
      this.updateStats();
      this.setState({
        alertVisible: true
      });
    }, 60000);
  }

  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      stats: {
        confirmed: 0,
        recovered: 0,
        deaths: 0,
        active: 0,
        lastUpdate: undefined,
      },
      countries: new Set(),
      confirmed: [],
      timeSeries: {
        labels: [],
        confirmed: [],
        recovered: [],
        deaths: [],
        dateTime: undefined
      },
      alertVisible: false
    };
    // init stats
    this.updateStats();
  }

  getStats() {
    axios.get('https://covid2019-api.herokuapp.com/v2/total')
      .then(({data}) => {
        this.setState({
          stats: {
            confirmed: data.data.confirmed,
            recovered: data.data.recovered,
            deaths: data.data.deaths,
            active: data.data.active,
            lastUpdate: data.lastUpdate
          }
        });
      })
      .catch(err => {
        console.error({err});
      })
  }

  getConfirmed() {
    axios.get('https://covid2019-api.herokuapp.com/v2/current')
      .then(({data}) => {
        let confirmed = data.data;
        this.setState({
          confirmed
        });
      })
      .catch(err => {
        console.error({err});
      })
  }

  getTimeSeries() {
    axios.get('https://covid2019-api.herokuapp.com/v2/timeseries/global')
      .then(({data}) => {
        const labels = data.data.map((d) => Object.keys(d)[0]);
        let confirmed = [];
        let recovered = [];
        let deaths = [];

        data.data.forEach(obj => {
          confirmed.push(Object.values(obj)[0].confirmed);
          recovered.push(Object.values(obj)[0].recovered);
          deaths.push(Object.values(obj)[0].deaths);
        });

        this.setState({
          timeSeries: {
            confirmed,
            recovered,
            deaths,
            labels,
            lastUpdate: data.dt
          }
        });

      })
      .catch(err => {
        console.log(err)
      })
  }

  updateStats() {
    this.getStats();
    this.getConfirmed();
    this.getTimeSeries();
    setTimeout(() => {
      this.setState({
        alertVisible: false
      });
    }, 5000)
  }

  numberFormat = (value) => (new Intl.NumberFormat('en-us').format(value));

  loading = () =>
    <div className="animated fadeIn pt-1 text-center">
      <div className="spinner-grow text-info" role="status">
        <span className="sr-only">جاري التحميل...</span>
      </div>
      <br/>
      <strong>جاري التحميل...</strong>
    </div>;

  render() {
    const {confirmed, recovered, deaths, active} = this.state.stats;

    let mainChart = {
      labels: this.state.timeSeries.labels,
      datasets: [
        {
          label: 'الحالات المؤكدة',
          backgroundColor: 'transparent',
          borderColor: brandWarning,
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: this.state.timeSeries.confirmed,
        },
        {
          label: 'حالات الشفاء',
          backgroundColor: 'transparent',
          borderColor: brandSuccess,
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: this.state.timeSeries.recovered,
        },
        {
          label: 'الوفيات',
          backgroundColor: 'transparent',
          borderColor: brandDanger,
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: this.state.timeSeries.deaths,
        },
      ],
    };
    const mainChartOpts = {
      tooltips: {
        enabled: false,
        custom: CustomTooltips,
        intersect: true,
        mode: 'index',
        position: 'nearest',
        callbacks: {
          labelColor: function (tooltipItem, chart) {
            return {backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor}
          }
        }
      },
      maintainAspectRatio: false,
      legend: {
        display: true,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              drawOnChartArea: false,
            },
          }],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5,
              stepSize: Math.ceil(250 / 5),
              max: confirmed,
            },
          }],
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3,
        },
      },
      pan: {
        enabled: true,
        mode: 'xy'
      },
      zoom: {
        enabled: true,
        mode: 'xy',
      }
    };

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-warning">
              <CardBody>
                <div className="text-value">{this.numberFormat(confirmed)}</div>
                <h3>الحالات المؤكدة</h3>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-google-plus">
              <CardBody>
                <div className="text-value">{this.numberFormat(active)}</div>
                <h3>الحالات النشطة</h3>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-success">
              <CardBody>
                <div className="text-value">{this.numberFormat(recovered)}</div>
                <h3>حالات الشفاء</h3>
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-danger">
              <CardBody>
                <div className="text-value">{this.numberFormat(deaths)}</div>
                <h3>الوفيات</h3>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="12">
            <Card>
              <CardHeader>
                الاصابات المؤكدة
              </CardHeader>
              <CardBody>
                {
                  !this.state.confirmed.length > 0 ? this.loading() :
                    (
                      <Table hover responsive className="mb-0 d-none d-sm-table animated fadeIn">
                        <thead className="thead-light">
                        <tr>
                          <th>المرتبة</th>
                          <th className="text-center" colSpan={2}>الدولة</th>
                          <th colSpan={2}>الاصابات</th>
                          <th colSpan={2}>شفاء</th>
                          <th colSpan={2}>وفات</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          this.state.confirmed.map((country, i) => {
                            country.name_ar = countriesAr[country.location];
                            country.iso2 = iso2[country.location] ? iso2[country.location].toLowerCase() : '';
                            const confirmedPercentage = ((country.confirmed / confirmed) * 100).toFixed(2);
                            const recoveredPercentage = ((country.recovered / recovered) * 100).toFixed(2);
                            const deathsPercentage = ((country.deaths / deaths) * 100).toFixed(2);
                            return (
                              <tr key={i}>
                                <td className="text-right">
                                  {i + 1}
                                </td>
                                <td className="text-centerd">
                                  <span>{country.name_ar}</span>
                                </td>
                                <td>
                                  <i
                                    className={`flag-icon flag-icon-${country.iso2 !== 'il' ? country.iso2 : ''} h4 mb-0`}
                                    title={country.iso2}/>
                                </td>
                                <td colSpan={2}>
                                  <h4><strong className="badge">{this.numberFormat(country.confirmed)}</strong></h4>
                                  <div className="clearfix">
                                    <div className="float-left">
                                      <strong>
                                        {confirmedPercentage}%
                                      </strong>
                                    </div>
                                  </div>
                                  <Progress className="progress-xs" color="warning" value={confirmedPercentage}/>
                                </td>
                                <td colSpan={2}>
                                  <h4><strong className="badge">{this.numberFormat(country.recovered)}</strong></h4>
                                  <div className="clearfix">
                                    <div className="float-left">
                                      <strong>
                                        {recoveredPercentage}%
                                      </strong>
                                    </div>
                                  </div>
                                  <Progress className="progress-xs" color="success" value={recoveredPercentage}/>
                                </td>
                                <td>
                                  <h4><strong className="badge">{this.numberFormat(country.deaths)}</strong></h4>
                                  <div className="clearfix">
                                    <div className="float-left">
                                      <strong>
                                        {deathsPercentage}%
                                      </strong>
                                    </div>
                                  </div>
                                  <Progress className="progress-xs" color="danger" value={deathsPercentage}/>
                                </td>
                              </tr>
                            )
                          })
                        }
                        </tbody>
                      </Table>
                    )
                }
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">السلاسل الزمنية</CardTitle>
                    <div className="small text-muted">{this.state.timeSeries.dateTime}</div>
                  </Col>
                </Row>
                {
                  !this.state.timeSeries.confirmed.length > 0 ? this.loading() :
                    (
                      <div className="chart-wrapper animated fadeIn" style={{height: 300 + 'px', marginTop: 40 + 'px'}}>
                        <Line data={mainChart} options={mainChartOpts} height={300}/>
                      </div>
                    )
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Alert color="success" isOpen={this.state.alertVisible} style={alertStyle}>
          تم تحديث البيانات
        </Alert>
      </div>
    );
  }
}

export default Dashboard;
