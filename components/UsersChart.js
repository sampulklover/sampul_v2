import adminStyles from '../styles/admin.module.scss';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const UsersChart = ({ summary }) => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRange, setSelectedRange] = useState('fullYear');
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
      },
    },
    xaxis: {
      type: 'category',
      categories: [],
      title: {
        text:
          selectedRange === 'fullYear' ? '12 Months' : `${selectedRange} Days`,
      },
    },
    yaxis: {
      title: {
        text: 'Active users',
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      show: true,
      showForSingleSeries: false,
      showForNullSeries: true,
      showForZeroSeries: true,
      position: 'top',
      horizontalAlign: 'right',
      markers: {
        radius: 12,
      },
    },
    colors: ['#2F1DA9', '#533DE9', '#EAECF0'],
  });

  const [chartSeries, setChartSeries] = useState([]);

  const getCurrentMonthList = () => {
    // const currentMonthIndex = new Date().getMonth();
    const labels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    // return labels.slice(0, currentMonthIndex + 1);
    return labels;
  };

  const getChartLabels = (days) => {
    const labels = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      );
    }
    return labels;
  };

  const getChartData = ({ type = 'all', labels }) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const lastMonth = (currentMonth - 1 + 12) % 12; // Handle January as last month of the previous year

    const currentYearData = summary.data?.profiles.filter((user) => {
      const userYear = new Date(user.created_at).getFullYear();
      return userYear === currentYear;
    });

    let allMonthData = currentYearData;

    if (type === 'all') {
      allMonthData = allMonthData;
    }
    if (type === 'unsubscribed') {
      allMonthData = allMonthData.filter(
        (user) => !user?.accounts?.is_subscribed
      );
    } else if (type === 'subscribed') {
      allMonthData = allMonthData.filter(
        (user) => user?.accounts?.is_subscribed
      );
    }

    let lastMonthData = currentYearData.filter((user) => {
      const userMonth = new Date(user.created_at).getMonth();
      return userMonth === lastMonth;
    });

    if (type === 'all') {
      lastMonthData = lastMonthData;
    }
    if (type === 'unsubscribed') {
      lastMonthData = lastMonthData.filter(
        (user) => !user?.accounts?.is_subscribed
      );
    } else if (type === 'subscribed') {
      lastMonthData = lastMonthData.filter(
        (user) => user?.accounts?.is_subscribed
      );
    }

    let currentMonthData = currentYearData.filter((user) => {
      const userMonth = new Date(user.created_at).getMonth();
      return userMonth === currentMonth;
    });

    if (type === 'all') {
      currentMonthData = currentMonthData;
    }
    if (type === 'unsubscribed') {
      currentMonthData = currentMonthData.filter(
        (user) => !user?.accounts?.is_subscribed
      );
    } else if (type === 'subscribed') {
      currentMonthData = currentMonthData.filter(
        (user) => user?.accounts?.is_subscribed
      );
    }

    var monthlyUser = [];
    if (labels) {
      const temptMonthlyUser = labels.map((month) => {
        let filteredUsers = currentYearData;
        if (type === 'unsubscribed') {
          filteredUsers = currentYearData.filter(
            (user) => !user?.accounts?.is_subscribed
          );
        } else if (type === 'subscribed') {
          filteredUsers = currentYearData.filter(
            (user) => user?.accounts?.is_subscribed
          );
        }

        return filteredUsers.filter((user) => {
          const userMonth = new Date(user.created_at).getMonth();
          return userMonth === labels.indexOf(month);
        }).length;
      });

      monthlyUser = temptMonthlyUser;
    }

    return {
      monthlyUser: monthlyUser,
      lastMonthUserCounts: lastMonthData.length,
      currentMonthUserCounts: currentMonthData.length,
      allMonthUserCounts: allMonthData.length,
    };
  };

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  useEffect(() => {
    const labels =
      selectedRange === 'fullYear'
        ? getCurrentMonthList()
        : getChartLabels(selectedRange);

    const data = {
      labels,
      series: [
        {
          name: 'Protect Users',
          data:
            selectedType == 'subscribed' || selectedType == 'all'
              ? getChartData({ type: 'subscribed', labels })?.monthlyUser
              : [],
        },
        {
          name: 'Basic Users',
          data:
            selectedType == 'unsubscribed' || selectedType == 'all'
              ? getChartData({ type: 'unsubscribed', labels })?.monthlyUser
              : [],
        },
        {
          name: 'Total Users',
          data:
            selectedType == 'all'
              ? getChartData({ type: 'all', labels })?.monthlyUser
              : [],
        },
      ],
    };

    setChartOptions({
      ...chartOptions,
      xaxis: {
        categories: data.labels,
        title: {
          text:
            selectedRange === 'fullYear'
              ? '12 Months'
              : `${selectedRange} Days`,
        },
      },
      legend: {
        show: true,
        showForSingleSeries: false,
        showForNullSeries: true,
        showForZeroSeries: true,
        position: 'top',
        horizontalAlign: 'right',
        markers: {
          radius: 12,
        },
      },
    });

    setChartSeries(data.series);
  }, [selectedRange, summary.data?.profiles, selectedType]);

  const renderRangeSelector = () => {
    return (
      <div class="btn-group">
        <button
          class="btn btn-light bg-white btn-text btn-sm"
          onClick={() => handleRangeChange('fullYear')}
        >
          12 months
        </button>
        <button
          class="btn btn-light bg-white btn-text btn-sm"
          onClick={() => handleRangeChange(30)}
        >
          30 Days
        </button>
        <button
          class="btn btn-light bg-white btn-text btn-sm"
          onClick={() => handleRangeChange(7)}
        >
          7 Days
        </button>
      </div>
    );
  };

  const getPercentageDifferent = (type = 'all') => {
    const countResult = getChartData({ type: type });
    const lastMonth = countResult.lastMonthUserCounts;
    const currentMonth = countResult.currentMonthUserCounts;

    const difference = currentMonth - lastMonth;

    let roundedPercentage = 0;
    if (lastMonth !== 0) {
      const percentageIncrease = (difference / lastMonth) * 100;
      roundedPercentage = Math.round(percentageIncrease);
    }

    let trend = '';
    let theme = '';
    if (roundedPercentage > 0) {
      trend = 'positive';
      theme = 'success';
    } else if (roundedPercentage < 0) {
      trend = 'negative';
      theme = 'danger';
    } else {
      trend = 'no-change';
      theme = 'default';
    }

    return { percentage: `${roundedPercentage}%`, trend, theme };
  };

  const chartMenuCard = ({
    title = 'Title',
    value = '0',
    percentage = '0%',
    status = 'default',
    onClick = () => {},
  }) => {
    const themeConfig = {
      default: {
        theme: adminStyles.default,
        icon: (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          ></svg>
        ),
      },
      success: {
        theme: adminStyles.success,
        icon: (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="trend-up-01">
              <path
                id="Icon"
                d="M11 3.5L7.06568 7.43432C6.86768 7.63232 6.76867 7.73133 6.65451 7.76842C6.55409 7.80105 6.44591 7.80105 6.34549 7.76842C6.23133 7.73133 6.13232 7.63232 5.93431 7.43431L4.56568 6.06568C4.36768 5.86768 4.26867 5.76867 4.15451 5.73158C4.05409 5.69895 3.94591 5.69895 3.84549 5.73158C3.73133 5.76867 3.63232 5.86768 3.43431 6.06569L1 8.5M11 3.5H7.5M11 3.5V7"
                stroke="#17B26A"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
        ),
      },
      danger: {
        theme: adminStyles.danger,
        icon: (
          <svg
            width="13"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="trend-down-01" clip-path="url(#clip0_454_3681)">
              <path
                id="Icon"
                d="M11.3333 8.5L7.39894 4.56568C7.20093 4.36768 7.10192 4.26867 6.98776 4.23158C6.88734 4.19895 6.77917 4.19895 6.67874 4.23158C6.56458 4.26867 6.46558 4.36768 6.26757 4.56569L4.89894 5.93432C4.70093 6.13232 4.60192 6.23133 4.48776 6.26842C4.38734 6.30105 4.27917 6.30105 4.17874 6.26842C4.06458 6.23133 3.96557 6.13232 3.76757 5.93431L1.33325 3.5M11.3333 8.5H7.83325M11.3333 8.5V5"
                stroke="#F04438"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_454_3681">
                <rect
                  width="12"
                  height="12"
                  fill="white"
                  transform="translate(0.333252)"
                />
              </clipPath>
            </defs>
          </svg>
        ),
      },
    };

    return (
      <>
        <div className={adminStyles.tabContainer} onClick={onClick}>
          <div className={adminStyles.tabHeader}>
            <div className={adminStyles.tabTitle}>{title}</div>
            <div className={adminStyles.totalUsers}>
              <div className={adminStyles.totalUsersValue}>{value}</div>
              <div
                className={`${adminStyles.percentageContainer} ${themeConfig[status].theme}`}
              >
                {themeConfig[status].icon}
                <div
                  className={`${adminStyles.percentageValue} ${themeConfig[status].theme}`}
                >
                  {percentage}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderTabSelector = () => {
    return (
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link active" data-bs-toggle="tab">
            {chartMenuCard({
              title: 'Total Users',
              value: getChartData({ type: 'all' })?.allMonthUserCounts,
              percentage: getPercentageDifferent('all')?.percentage,
              status: getPercentageDifferent('all').theme,
              onClick: () => {
                setSelectedType('all');
              },
            })}
          </button>
          <button class="nav-link" data-bs-toggle="tab">
            {chartMenuCard({
              title: 'Basic Users',
              value: getChartData({ type: 'unsubscribed' })?.allMonthUserCounts,
              percentage: getPercentageDifferent('unsubscribed')?.percentage,
              status: getPercentageDifferent('unsubscribed').theme,
              onClick: () => {
                setSelectedType('unsubscribed');
              },
            })}
          </button>
          <button class="nav-link" data-bs-toggle="tab">
            {chartMenuCard({
              title: 'Protect Users',
              value: getChartData({ type: 'subscribed' })?.allMonthUserCounts,
              percentage: getPercentageDifferent('subscribed')?.percentage,
              status: getPercentageDifferent('subscribed').theme,
              onClick: () => {
                setSelectedType('subscribed');
              },
            })}
          </button>
        </div>
      </nav>
    );
  };

  return (
    <div>
      {renderTabSelector()}
      <div className="table-responsive mt-3">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={400}
        />
      </div>
      <hr />
      <div>{renderRangeSelector()}</div>
    </div>
  );
};

export default UsersChart;
