import plotly.graph_objects as go
import plotly.io as io

def marker_color(df):
    if "Volume" in df and "Close" in df:
        res = []
        for i in range(1, len(df["Volume"])):
            if df["Close"][i] > df["Close"][i - 1]:
                res.append("red")
            elif df["Close"][i] == df["Close"][i - 1]:
                res.append("white")
            else:
                res.append("green")
        return res
    else:
        raise Exception("Dataframe format mismatch: tried to access non-existent columns")

def graph_candlestick(df, title, interval):
    try:
        candle_fig = go.Figure(data=[go.Candlestick(name="",
                                                    x=df["Date"][1:],
                                                    open=df["Open"][1:],
                                                    high=df["High"][1:],
                                                    low=df["Low"][1:],
                                                    close=df["Close"][1:],
                                                    increasing_line_color="red",
                                                    decreasing_line_color="green"),
                                     go.Scatter(name="MA5",
                                                x=df["Date"][1:],
                                                y=df["MA5"][1:],
                                                line=dict(color="rgb(255, 255, 0)", width=1),
                                                mode="lines", hovertemplate='%{x}<br>%{y}'),
                                     go.Scatter(name="MA10",
                                                x=df["Date"][1:],
                                                y=df["MA10"][1:],
                                                line=dict(color="rgb(248, 148, 6)", width=1),
                                                mode="lines", hovertemplate='%{x}<br>%{y}'),
                                     go.Scatter(name="MA20",
                                                x=df["Date"][1:],
                                                y=df["MA20"][1:],
                                                line=dict(color="rgb(25, 181, 254)", width=1),
                                                mode="lines", hovertemplate='%{x}<br>%{y}'),
                                     go.Scatter(name="MA30",
                                                x=df["Date"][1:],
                                                y=df["MA30"][1:],
                                                line=dict(color="rgb(255, 20, 147)", width=1),
                                                mode="lines", hovertemplate='%{x}<br>%{y}'),
                                     go.Scatter(name="MA60",
                                                x=df["Date"][1:],
                                                y=df["MA60"][1:],
                                                line=dict(color="rgb(147, 112, 219)", width=1),
                                                mode="lines", hovertemplate='%{x}<br>%{y}')])

        candle_fig.update_layout(title=title, xaxis_rangeslider_visible=False, showlegend=True,
                                 legend=dict(title_text="Click to show or hide graphs:",
                                            orientation="h",
                                             yanchor="bottom",
                                             y=1.02,
                                             xanchor="right",
                                             x=1),
                                 margin=dict(l=29, r=0, b=0, t=50, pad=0),
                                 paper_bgcolor="rgb(0, 0, 0)", plot_bgcolor="rgb(0, 0, 0)",
                                 font_color="rgba(255, 255, 255, 0.5)", title_font_color="#eee")

        candle_fig.update_xaxes(showline=True, linewidth=1, linecolor="rgba(255, 255, 255, 0.5)",
                                gridwidth=1, gridcolor="rgba(255, 255, 255, 0.5)")

        candle_fig.update_yaxes(showline=True, linewidth=1, linecolor="rgba(255, 255, 255, 0.5)",
                                gridwidth=1, gridcolor="rgba(255, 255, 255, 0.5)")
        if interval == "Daily":
            candle_fig.update_xaxes(rangebreaks=[dict(bounds=["sat", "mon"])])

        return io.to_html(candle_fig, include_plotlyjs="cdn", full_html=False)
    except Exception as e: print(e)

def graph_volume(df, interval):
    try:
        vol_fig = go.Figure(data=[go.Bar(
            name="",
            x=df["Date"][1:],
            y=df["Volume"][1:],
            marker=dict(
                color=marker_color(df),
                line=dict(width=0)),
            hovertemplate='%{x}<br>%{y}')])

        vol_fig.update_layout(title="Volume", showlegend=False,
                                 margin=dict(l=0, r=0, b=0, t=50, pad=0),
                                 paper_bgcolor="rgb(0, 0, 0)", plot_bgcolor="rgb(0, 0, 0)",
                                 font_color="rgba(255, 255, 255, 0.5)", title_font_color="#eee")
        vol_fig.update_xaxes(showline=True, linewidth=1, linecolor="rgba(255, 255, 255, 0.5)",
                                gridwidth=1, gridcolor="rgba(255, 255, 255, 0.5)")
        vol_fig.update_yaxes(showline=True, linewidth=1, linecolor="rgba(255, 255, 255, 0.5)",
                                gridwidth=1, gridcolor="rgba(255, 255, 255, 0.5)")
        if interval == "Daily":
            vol_fig.update_xaxes(rangebreaks=[dict(bounds=["sat", "mon"])])

        # os.remove("./templates/vol_fig.html")
        return io.to_html(vol_fig, include_plotlyjs=True, full_html=False)
    except Exception as e: print(e)