import React from 'react'
import { View, StyleSheet, TouchableOpacity, FlatList, Modal, Text, ActivityIndicator,  } from 'react-native'
import { AntDesign } from "@expo/vector-icons"
import colors from '../Colors'
import TodoList from '../components/TodoList'
import AddListModal from '../components/AddListModal'
import Fire from '../Fire'
import FireMenu from '../api/FoodsApi'
import MenuList from '../components/MenuList'
import firebase from '../database/firebaseDb';

export default class ShoppingScreen extends React.Component {
    state = {
        addTodoVisible:  false,
        lists: [],
        user: {},
        loading: true,
        userID: '',
        menu: [],
    }



    componentDidMount() {
        fireTodo = new Fire((error, user) => {
            if (error) {
                return alert('Please login to use the app')
            }

            fireTodo.getLists(lists => {
                this.setState({lists, user}, () => {
                    this.setState({ loading: false })
                })
            })

            this.setState({user})

            if (user.uid != undefined || user.uid != null ) {
                this.setState({userID: user.uid})
            }
            
        });

        fireMenu = new FireMenu(() => {
            fireMenu.getLists(menu => {
                this.setState({menu}, () => {
                    this.setState({loading: false})
                })
            })
        })
    }  

    componentWillUnmount() {
        fireTodo.detach()
    }


    toggleAddTodoModal() {
        this.setState({ addTodoVisible: !this.state.addTodoVisible })
    }
 

    renderList = list => {
        return <TodoList list={list} updateList={this.updateList}/>
    }

    renderMenu = list => {
        return <MenuList list={list} updateList={this.updateMenu}/>
    }

    addList = list => {
        fireTodo.addList({
            name: list.name,
            color: list.color,
            todos: []
        })
    }

    updateList = list => {
        fireTodo.updateList(list)
    }

    updateMenu = list => {
        fireMenu.updateMenu(list)
    }


    render() {
      if (this.state.loading) {
          return (
          <View style={styles.container}>
              <ActivityIndicator size='large' color={colors.blue}/>
          </View>
          )
      }
        return (
                <View style={styles.container}>

                    <Modal
                        animationType="slide"
                        visible={this.state.addTodoVisible}
                        onRequestClose={() => this.toggleAddTodoModal()}
                    >
                        <AddListModal 
                            closeModal={() => this.toggleAddTodoModal()}
                            addList={this.addList}
                        />
                    </Modal>
                    <View style={{flexDirection: "row"}}>
                        <View style={styles.divider} />
                        <Text style={styles.title}>
                            Shopping <Text style={{fontWeight: "300", color: colors.blue}}>List</Text>
                        </Text>
                        <View style={styles.divider} />
                    </View>
                    {/* Hiding add shopping list functionality
                    {this.state.userID == 'Rgn6TGrPMkfEiusBy8p8XVv3aCb2' ? 
                    <View style={{marginVertical: 8}}>
                        <TouchableOpacity style={styles.addList} onPress={() => {this.toggleAddTodoModal(); this.sendPushNotification()}}>
                            <AntDesign name="plus" size={16} color={colors.blue} />
                        </TouchableOpacity>

                    </View>: <View><Text></Text></View>
                    }
                */}
                    <View style={{height: 190}}>
                        <FlatList 
                            data={this.state.lists} 
                            keyExtractor={item => item.id.toString()} 
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) => this.renderList(item)}
                            keyboardShouldPersistTaps="always"
                        />
                    </View>  
                    <View style={{flexDirection: "row"}}>
                        
                        <View style={styles.divider} />
                        <Text style={styles.menuTitle}>
                            Summer <Text style={{fontWeight: "100", color: colors.red}}>Menu</Text>
                        </Text>
                        <View style={styles.divider} />
                    </View> 
                    <View style={{flexDirection: "row", alignSelf: 'flex-start'}}>
                        <Text style={{marginLeft: 10, marginRight: 10}}>Week 1</Text>
                    </View>
                    <View style={{height: 250,}}>
                        <FlatList 
                            data={this.state.menu} 
                            keyExtractor={item => item.id.toString()} 
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) => this.renderMenu(item)}
                            keyboardShouldPersistTaps="always"
                        />
                    </View>   
                    </View>            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        //justifyContent: 'center',
        marginTop: 30,
    },
    divider: {
        backgroundColor: colors.lightBlue,
        height: 1,
        flex: 1,
        alignSelf: 'center'
    },
    title: {
        fontSize: 38,
        fontWeight: "700",
        color: colors.black,
        paddingHorizontal: 64,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.black,
        paddingHorizontal: 64,
    },
    addList: {
        marginTop: -55,
        marginLeft: 300,
        borderWidth: 2,
        borderColor: colors.lightBlue,
        borderRadius: 4,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    add: {
        color: colors.blue,
        fontWeight: "600",
        fontSize: 14,
        marginTop: 8,
    }
})