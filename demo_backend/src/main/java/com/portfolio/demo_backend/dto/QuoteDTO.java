package com.portfolio.demo_backend.dto;

public class QuoteDTO {
    private double current;
    private double change;
    private double percentChange;
    private double high;
    private double low;
    private double open;
    private double previousClose;
    private long timestamp;

    public QuoteDTO() {
    }

    public QuoteDTO(double current, double change, double percentChange,
            double high, double low, double open,
            double previousClose, long timestamp) {
        this.current = current;
        this.change = change;
        this.percentChange = percentChange;
        this.high = high;
        this.low = low;
        this.open = open;
        this.previousClose = previousClose;
        this.timestamp = timestamp;
    }

    public double getCurrent() {
        return current;
    }

    public void setCurrent(double current) {
        this.current = current;
    }

    public double getChange() {
        return change;
    }

    public void setChange(double change) {
        this.change = change;
    }

    public double getPercentChange() {
        return percentChange;
    }

    public void setPercentChange(double percentChange) {
        this.percentChange = percentChange;
    }

    public double getHigh() {
        return high;
    }

    public void setHigh(double high) {
        this.high = high;
    }

    public double getLow() {
        return low;
    }

    public void setLow(double low) {
        this.low = low;
    }

    public double getOpen() {
        return open;
    }

    public void setOpen(double open) {
        this.open = open;
    }

    public double getPreviousClose() {
        return previousClose;
    }

    public void setPreviousClose(double previousClose) {
        this.previousClose = previousClose;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
