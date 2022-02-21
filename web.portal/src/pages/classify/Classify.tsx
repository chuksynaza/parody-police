import React, { FC, useEffect, useState } from "react";
import { Template } from "../../components/template";
import { Input, Button, Alert } from "antd";
import styled from "styled-components";
import { Link, useLocation, useHistory } from "react-router-dom";
import { ScrapeHistoryState } from "../home/Home";
import { classifyArticle } from "../../services";
import Title from "antd/lib/typography/Title";
const { TextArea } = Input;

const StyledContainer = styled.div`
  display: flex;
  padding: 50px;
  flex-direction: column;
`;

const Label = styled.div`
  padding: 0px 10px;
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

const StyledTextArea = styled(TextArea)`
  width: 100%;
`;

const LargeText = styled.span`
  font-weight: bold;
  font-size: 20px;
`;

export const ClassificationPage: FC = () => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [scrapeError, setScrapeError] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [classificationError, setClassificationError] = useState<boolean>(
    false
  );
  const [valid, setValid] = useState<boolean>(false);
  const { state } = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (state && (state as ScrapeHistoryState).scrapeStatus) {
      const locationScrapeState = state as ScrapeHistoryState;
      console.log("PPPP location state", locationScrapeState);
      if (locationScrapeState.scrapeStatus === "success") {
        setTitle(locationScrapeState.scrapeResult?.title as string);
        setBody(locationScrapeState.scrapeResult?.body as string);
      } else {
        setScrapeError(true);
      }
    }
  }, [state]);

  useEffect(() => {
    if (body.split(" ").length >= 20) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [body]);

  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const onChangeBody = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
  };
  const analyzeClickHandler = async () => {
    setClassificationError(false);
    setScrapeError(false);
    setAnalyzing(true);
    const articleTitle =
      title.split(" ").length >= 5
        ? title
        : body.split(" ").slice(0, 15).join(" ");
    const classificationResult = await classifyArticle({
      title: articleTitle,
      body,
    });
    if (!classificationResult) {
      setClassificationError(true);
      setAnalyzing(false);
      return;
    }
    console.log("Classification result: ", classificationResult);
    history.push(`/results/${classificationResult._id!}`, classificationResult);
  };

  return (
    <Template>
      <StyledContainer>
        <Title level={4}> Classify Article </Title>
        {scrapeError && (
          <StyledColumn>
            <Alert
              message="Unable to Fetch Article"
              description="Sorry, we had trouble fetching that article, it could be that we don't support automatically retrieving articles from that source yet. Please manually enter the article details below"
              type="warning"
              showIcon
              closable
            />
          </StyledColumn>
        )}
        {classificationError && (
          <StyledColumn>
            <Alert
              message="Unable to Classify Article"
              description="Sorry, we couldn't classify this article at the moment, please try again later"
              type="error"
              showIcon
              closable
            />
          </StyledColumn>
        )}
        <Label>Article Title</Label>
        <StyledColumn>
          <Input
            placeholder="Article Title"
            value={title}
            onChange={onChangeTitle}
          />
        </StyledColumn>
        <Label>Article Text</Label>
        <StyledColumn>
          <StyledTextArea
            placeholder="Body of the Article"
            rows={8}
            value={body}
            onChange={onChangeBody}
          />
        </StyledColumn>
        <StyledRow>
          <Button
            type="primary"
            disabled={analyzing || !valid}
            onClick={analyzeClickHandler}
          >
            {analyzing ? "Crunching Data..." : "Classify Article"}
          </Button>
        </StyledRow>
        <StyledRow>
          <LargeText>OR</LargeText>
        </StyledRow>
        <StyledRow>
          <Link to="/">
            <Button type="link"> Fetch article with URL</Button>
          </Link>
        </StyledRow>
      </StyledContainer>
    </Template>
  );
};
