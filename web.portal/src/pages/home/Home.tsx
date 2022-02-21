import React, { FC, useEffect, useState } from "react";
import { Template } from "../../components/template";
import { Input, Button } from "antd";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { scrapeWebsite } from "../../services";
import { ScrapeResult } from "../../services/Scrape";
import Title from "antd/lib/typography/Title";

export interface ScrapeHistoryState {
  scrapeStatus?: "success" | "error";
  scrapeResult?: ScrapeResult;
}

const StyledContainer = styled.div`
  display: flex;
  padding: 50px;
  flex-direction: column;
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 10px;
`;

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
`;

const LargeText = styled.span`
  font-weight: bold;
  font-size: 20px;
`;

export const HomePage: FC = () => {
  const [scraping, setScraping] = useState<boolean>(false);
  const [scrapeUrl, setScrapeUrl] = useState<string>("");
  const [valid, setValid] = useState<boolean>(false);
  const history = useHistory();
  const scrapeHistoryState: ScrapeHistoryState = {};

  useEffect(() => {
    if (scrapeUrl.match(/(https?:\/\/)(www.)?([^/]*)(\/){0,1}(.*)/)) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [scrapeUrl]);

  const onChangeScrapeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScrapeUrl(event.target.value);
  };
  const scrapeClickHandler = async () => {
    setScraping(true);
    scrapeHistoryState.scrapeStatus = "error";
    const scrapeResult = await scrapeWebsite(scrapeUrl);
    console.log("PPPP ScrapeO Result", scrapeResult);
    if (scrapeResult) {
      console.log("PPPP Scrape Result", scrapeResult);
      scrapeHistoryState.scrapeStatus = "success";
      scrapeHistoryState.scrapeResult = scrapeResult;
    }
    history.push("/classify", scrapeHistoryState);
    // setScraping(false);
  };

  return (
    <Template>
      <StyledContainer>
        <Title level={4}> Fetch &amp; Analyze Article </Title>
        <StyledColumn>
          <Input
            placeholder="Enter Article URL: eg. https://www.newssite.com/article"
            onChange={onChangeScrapeUrl}
            value={scrapeUrl}
          />
        </StyledColumn>
        <StyledRow>
          <Button
            type="primary"
            disabled={scraping || !valid}
            onClick={scrapeClickHandler}
          >
            {scraping ? "Fetching..." : "Fetch & Classify"}
          </Button>
        </StyledRow>
        <StyledRow>
          <LargeText>OR</LargeText>
        </StyledRow>
        <StyledRow>
          <Link to="/classify">
            <Button type="link" disabled={scraping}>
              {" "}
              Manually Enter Article Details
            </Button>
          </Link>
        </StyledRow>
      </StyledContainer>
    </Template>
  );
};
