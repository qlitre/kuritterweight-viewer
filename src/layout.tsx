import { html } from 'hono/html'

type Data = {
  xList: number[]
  yList: number[]
  children?: any
}



export const Layout = (props: Data) => html`<!DOCTYPE html>
<html lang="ja">
  <head>
  <meta charset="utf-8" />
  <title>kuritterweight-viewer</title>
  <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css" />
  <link rel="stylesheet" href="/static/style.css" />
  </head>
  <body>
  ${props.children}
  </body>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>    
  <script>
    const ctx = document.getElementById('myChart');
    const timestamps = ${JSON.stringify(props.xList)};
    const weightValues = ${JSON.stringify(props.yList)};
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [{
          label: 'kuritterweight',
          data: weightValues,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 55,
            max: 70
          }
        }
      }
    });
  </script>
</html>`

export const HomeContent = (props: {
  Data: Data,
}) => (
  <Layout {...props.Data}>
    <header>
      <h1>kuritterweight-viewer</h1>
      <nav>
        <a href="/?days=30">30日</a>
        <a href="/?days=90">90日</a>
        <a href="/?days=365">365日</a>
      </nav>
    </header>
    <main>
      <canvas id="myChart"></canvas>
    </main>
  </Layout>
)