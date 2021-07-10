import { css } from "@emotion/react";
import { Collapse, Drawer, List, ListItem, ListItemIcon, ListItemText, Menu } from "@material-ui/core";
import { ExpandLess, ExpandMore, MoveToInbox } from "@material-ui/icons";
import { useLocalStorageState, useMount } from "ahooks";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getForumList } from "../api/api";
import { ForumGroup, ForumItem } from "../models/ForumList";
import { useForumList } from "../utils/updateForumList";

const ForumListView: React.FC = () => {
  const [forumList] = useForumList()

  const [groups, setG] = useState<JSX.Element[]>([])
  useEffect(() => {
    if (forumList) {
      setG(forumList.map(g => <ForumGroupList key={g.id} group={g} />))
    }
  }, [forumList])

  return (
    <List disablePadding css={css`
      height: 100%;
      overflow: auto;
    `}>
      {groups}
    </List>
  );
}

export default ForumListView

const ForumGroupList: React.FC<{ group: ForumGroup }> = ({ group }) => {
  const items = group.forums.map(item => <ForumMenuItem key={item.id} item={item} />)
  const [open, setOpen] = useState(false)

  return (
    <React.Fragment>
      <ListItem
        button
        onClick={() => setOpen(!open)}
      >
        <ListItemIcon>
          <MoveToInbox />
        </ListItemIcon>
        <ListItemText primary={group.name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} >
        <List component="div" disablePadding >
          {items}
        </List>
      </Collapse>
    </React.Fragment>
  );
}

const ForumMenuItem: React.FC<{ item: ForumItem }> = ({ item }) => {
  const history = useHistory()

  return (
    <ListItem
      button
      onClick={() => history.push(`/f/${item.name}`)}
    >
      <span dangerouslySetInnerHTML={{ __html: item.showName || item.name }} />
    </ListItem>
  );
}