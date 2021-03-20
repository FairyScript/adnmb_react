import { Collapse, Drawer, List, ListItem, ListItemIcon, ListItemText, Menu } from "@material-ui/core";
import { ExpandLess, ExpandMore, MoveToInbox } from "@material-ui/icons";
import { useMount, useSessionStorageState } from "ahooks";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getForumList } from "../api/api";

const ForumListView: React.FC = () => {
  const history = useHistory()
  const [forumList, setList] = useSessionStorageState<ForumList>('forumList')
  useMount(async () => {
    if (!forumList) {
      const list = await getForumList()
      setList(list)
    }
  })

  const [groups, setG] = useState<JSX.Element[]>([])
  useEffect(() => {
    if (forumList) {
      setG(forumList.map(g => <ForumGroup key={g.id} group={g} />))
    }
  }, [forumList])

  return (
    <Drawer>
      <List>
        {groups}
      </List>
    </Drawer>
  );
}

export default ForumListView

const ForumGroup: React.FC<{ group: ForumGroup }> = ({ group }) => {
  const items = group.forums.map(item => <ForumMenuItem key={item.id} item={item} />)
  const [open, setOpen] = useState(false)

  return (
    <>
    <ListItem button onClick={() => setOpen(!open)} >
      <ListItemIcon>
        <MoveToInbox />
      </ListItemIcon>
      <ListItemText primary="Inbox" />
      {open ? <ExpandLess /> : <ExpandMore />}
    </ListItem>
    <Collapse in={open} unmountOnExit >
      <List component="div" disablePadding >
        {items}
      </List>
    </Collapse>
    </>
  );
}

const ForumMenuItem: React.FC<{ item: ForumItem }> = ({ item }) => {
  return (
    <ListItem>{item.showName || item.name}</ListItem>
  );
}