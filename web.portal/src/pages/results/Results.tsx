import React, { FC, useEffect, useState } from "react";
import { Template } from "../../components/template";
import { Alert, Card, Badge, Skeleton } from "antd";
import styled from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import { ClassificationResult, getClassification, SentimentCategory } from "../../services/Classify";
import Title from "antd/lib/typography/Title";
const { Ribbon } = Badge;

const StyledContainer = styled.div`
  display: flex;
  padding: 50px;
  flex-direction: column;
`;

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
`;

export const ResultsPage: FC = () => {
  const [loadingResults, setLoadingResults] = useState<boolean>(true);
  const [results, setResults] = useState<ClassificationResult>();
  const [classificationResultsError, setclassificationResultsError] = useState<boolean>(false);
  const { state } = useLocation();
  const { classificationId } = useParams<{classificationId: string}>();
  
  const fetchClassification = async () => {
    setLoadingResults(true);
    setclassificationResultsError(false);
    const fetchClassificationResultsResponse = await getClassification(classificationId);
    if(fetchClassificationResultsResponse){
      setResults(fetchClassificationResultsResponse);
      setLoadingResults(false);
      return;
    }
    setclassificationResultsError(true);
    setLoadingResults(false);
  }

  useEffect(() => {
    if (state && (state as ClassificationResult).averagePrediction) {
      // Retrieve from state
      // FIXME: Probably take this out later and always fetch the results?
      const classificationHistoryState = state as ClassificationResult;
      setResults(classificationHistoryState);
      setLoadingResults(false);
    } else {
      // Fetch with URL
      fetchClassification();
    }
  }, [state]);

  return (
    <>
      <Template>
        <StyledContainer>
          <Title level={4}> Classification Results </Title>
          {classificationResultsError && (
          <StyledColumn>
            <Alert
              message="Unable to Retrieve Classification Results"
              description="Sorry, we couldn't find those results you were looking for"
              type="error"
              showIcon
              closable
            />
          </StyledColumn>
        )}
          {results && !loadingResults && (
            <>
              <StyledColumn>
                {1 - results.averagePrediction >= 0.7 && (
                  <Alert
                    message="This article seems to be accurate"
                    type="success"
                    showIcon
                  />
                )}
                {1 - results.averagePrediction >= 0.5 &&
                  1 - results.averagePrediction < 0.7 && (
                    <Alert
                      message="This article seems to be mostly accurate"
                      type="warning"
                      showIcon
                    />
                  )}
                {1 - results.averagePrediction < 0.5 && (
                  <Alert
                    message="This article seems to be inaccurate"
                    type="error"
                    showIcon
                  />
                )}
              </StyledColumn>
              <StyledColumn>
                <Ribbon text={SentimentCategory[results.titleSentimentCategory!]}>
                  <Card type="inner" title="Title sentiment">
                    The title of this article displays
                    a negative sentiment score of <b>{results.titleSentimentNegativeScore}</b>,
                    a neutral sentiment score of <b>{results.titleSentimentNeutralScore}</b> and 
                    a positive sentiment score of <b>{results.titleSentimentPositiveScore}</b>
                    <p>
                      Article titles with higher levels of negative or positive
                      sentiment might be emotionally catchy but misleading
                    </p>
                  </Card>
                </Ribbon>
              </StyledColumn>
              <StyledColumn>
                <Ribbon text={SentimentCategory[results.bodySentimentCategory!]}>
                  <Card type="inner" title="Body sentiment">
                    The body of this article displays
                    a negative sentiment score of <b>{results.bodySentimentNegativeScore}</b>, 
                    a neutral sentiment score of <b>{results.bodySentimentNeutralScore}</b> and
                    a positive sentiment score of  <b>{results.bodySentimentPositiveScore}</b>
                  </Card>
                </Ribbon>
              </StyledColumn>
              <StyledColumn>
                <Ribbon text={results.searchEstimatedMatches}>
                  <Card type="inner" title="Estimated matches on the web">
                    Top search results also show 
                    <b> {results.searchUniqueDomainCount} </b> unique domains
                    <p>
                      Articles with fewer matches might be fabricated,
                      especially when they have not been published recently
                    </p>
                  </Card>
                </Ribbon>
              </StyledColumn>
            </>
          )}

          {loadingResults && (
            <StyledColumn>
              <Skeleton active />
            </StyledColumn>
          )}
        </StyledContainer>
      </Template>
    </>
  );
};
