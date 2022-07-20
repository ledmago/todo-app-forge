import { FC } from "react";

import { css, jsx } from "@emotion/core";
import moment from "moment";
import Avatar from "@atlaskit/avatar";

function createKey(input) {
  return input ? input.replace(/^(the|a|an)/, "").replace(/\s/g, "") : input;
}

const nameWrapperStyles = css({
  display: "flex",
  alignItems: "center",
});

const NameWrapper = ({ children }) => (
  <span css={nameWrapperStyles}>{children}</span>
);

const avatarWrapperStyles = css({
  display: "flex",
  alignItems: "center",
});

const AvatarWrapper = ({ children }) => (
  <div css={avatarWrapperStyles}>{children}</div>
);

export const caption = "List of US Presidents";

export const createHead = (withWidth) => {
  return {
    cells: [
      {
        key: "avatar",
        content: "Avatar",
        isSortable: true,
        width: withWidth ? 25 : undefined,
      },
      {
        key: "name",
        content: "Name",
        isSortable: true,
        width: withWidth ? 25 : undefined,
      },
      {
        key: "date",
        content: "Change Date",
        isSortable: true,
        width: withWidth ? 25 : undefined,
      },
      {
        key: "changedField",
        content: "Changed Field",
        isSortable: true,
        width: withWidth ? 25 : undefined,
      },
      {
        key: "changedFrom",
        content: "Changed From",
        isSortable: true,
        width: withWidth ? 25 : undefined,
      },
      {
        key: "changedTo",
        content: "Changed To",
        isSortable: false,
        width: withWidth ? 25 : undefined,
      },
    ],
  };
};

export const head = createHead(false);

export const emptyRow = [
  {
    key: `empty-row-0`,
    isHighlighted: false,
    cells: [
      {
        key: "avatar",
        content: "There is no changes to show",
      },
    ],
  },
];
export const rows = (changeLogs) =>
  changeLogs.flatMap((changeLog, index) => {
    return changeLog?.items.map((changedItem) => ({
      key: `row-${index}-${changeLog.name}`,
      isHighlighted: false,
      cells: [
        {
          key: "avatar",
          content: (
            <AvatarWrapper>
              <Avatar
                name={changeLog.author.displayName}
                src={changeLog.author.avatarUrls["32x32"]}
                size="small"
              />
            </AvatarWrapper>
          ),
        },
        {
          key: "name",
          content: (
            <NameWrapper>
              <a href="https://atlassian.design">
                {changeLog.author.displayName}
              </a>
            </NameWrapper>
          ),
        },
        {
          key: "date",
          content: moment(changeLog.created).format("DD-MM-YYYY HH:mm"),
        },
        {
          key: "changedField",
          content: changedItem.field || " - ",
        },
        {
          key: "changedFrom",
          content: changedItem.fromString || changedItem.from,
        },
        {
          key: "changedTo",
          content: changedItem.toString || changedItem.to,
        },
      ],
    }));
  });
