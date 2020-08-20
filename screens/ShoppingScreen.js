import React from 'react'
import { View, StyleSheet, TouchableOpacity, FlatList, Modal, Text, ActivityIndicator, ScrollView } from 'react-native'
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
        menuYellowWeek2: [],
        menuYellowWeek3: [],
        menuYellowWeek4: [],
        menuBlueWeek1: [],
        menuBlueWeek2: [],
        menuBlueWeek3: [],
        menuBlueWeek4: [],
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
        //step 4
        fireMenuSummerWeekTwo = new FireMenu(() => {
            fireMenuSummerWeekTwo.getListsForSummerWeekTwo(menuYellowWeek2 => {
                this.setState({menuYellowWeek2}, () => {
                    this.setState({loading: false})
                })
            })
        })

        fireMenuSummerWeekThree = new FireMenu(() => {
            fireMenuSummerWeekThree.getListsForSummerWeekThree(menuYellowWeek3 => {
                this.setState({menuYellowWeek3}, () => {
                    this.setState({loading: false})
                })
            })
        })

        fireMenuSummerWeekFour = new FireMenu(() => {
            fireMenuSummerWeekFour.getListsForSummerWeekFour(menuYellowWeek4 => {
                this.setState({menuYellowWeek4}, () => {
                    this.setState({loading: false})
                })
            })
        })

        fireMenuWinterWeekOne = new FireMenu(() => {
            fireMenuWinterWeekOne.getListsForWinterWeekOne(menuBlueWeek1 => {
                this.setState({menuBlueWeek1}, () => {
                    this.setState({loading: false})
                })
            })
        })

        fireMenuWinterWeekTwo = new FireMenu(() => {
            fireMenuWinterWeekTwo.getListsForWinterWeekTwo(menuBlueWeek2 => {
                this.setState({menuBlueWeek2}, () => {
                    this.setState({loading: false})
                })
            })
        })

        fireMenuWinterWeekThree = new FireMenu(() => {
            fireMenuWinterWeekThree.getListsForWinterWeekThree(menuBlueWeek3 => {
                this.setState({menuBlueWeek3}, () => {
                    this.setState({loading: false})
                })
            })
        })

        fireMenuWinterWeekFour = new FireMenu(() => {
            fireMenuWinterWeekFour.getListsForWinterWeekFour(menuBlueWeek4 => {
                this.setState({menuBlueWeek4}, () => {
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

    renderMenuTwo = list => {
        return <MenuList list={list} updateList={this.updateMenuTwo}/>
    }

    renderMenuThree = list => {
        return <MenuList list={list} updateList={this.updateMenuThree}/>
    }

    renderMenuFour = list => {
        return <MenuList list={list} updateList={this.updateMenuFour}/>
    }

    renderWinterMenuOne = list => {
        return <MenuList list={list} updateList={this.updateWinterMenuOne}/>
    }

    renderWinterMenuTwo = list => {
        return <MenuList list={list} updateList={this.updateWinterMenuTwo}/>
    }

    renderWinterMenuThree = list => {
        return <MenuList list={list} updateList={this.updateWinterMenuThree}/>
    }

    renderWinterMenuFour = list => {
        return <MenuList list={list} updateList={this.updateWinterMenuFour}/>
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
    //step 5
    updateMenu = list => {
        fireMenu.updateMenu(list)
    }

    updateMenuTwo = list => {
        fireMenuSummerWeekTwo.updateMenuForSummerWeekTwo(list)
    }

    updateMenuThree = list => {
        fireMenuSummerWeekThree.updateMenuForSummerWeekThree(list)
    }

    updateMenuFour = list => {
        fireMenuSummerWeekFour.updateMenuForSummerWeekFour(list)
    }

    updateWinterMenuOne = list => {
        fireMenuWinterWeekOne.updateMenuForWinterWeekOne(list)
    }

    updateWinterMenuTwo = list => {
        fireMenuWinterWeekTwo.updateMenuForWinterWeekTwo(list)
    }

    updateWinterMenuThree = list => {
        fireMenuWinterWeekThree.updateMenuForWinterWeekThree(list)
    }

    updateWinterMenuFour = list => {
        fireMenuWinterWeekFour.updateMenuForWinterWeekFour(list)
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
            <ScrollView style={{marginTop: 30}}> 
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
                    <View style={{flexDirection: "row", alignSelf: 'flex-start'}}>
                        <Text style={{marginLeft: 10, marginRight: 10}}>Week 2</Text>
                    </View> 
                    <View style={{height: 250,}}>
                        <FlatList 
                            data={this.state.menuYellowWeek2} 
                            keyExtractor={item => item.id.toString()} 
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) => this.renderMenuTwo(item)}
                            keyboardShouldPersistTaps="always"
                        />
                    </View>
                    <View style={{flexDirection: "row", alignSelf: 'flex-start'}}>
                        <Text style={{marginLeft: 10, marginRight: 10}}>Week 3</Text>
                    </View> 
                    <View style={{height: 250,}}>
                        <FlatList 
                            data={this.state.menuYellowWeek3} 
                            keyExtractor={item => item.id.toString()} 
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) => this.renderMenuThree(item)}
                            keyboardShouldPersistTaps="always"
                        />
                    </View>
                    <View style={{flexDirection: "row", alignSelf: 'flex-start'}}>
                        <Text style={{marginLeft: 10, marginRight: 10}}>Week 4</Text>
                    </View> 
                    <View style={{height: 250,}}>
                        <FlatList 
                            data={this.state.menuYellowWeek4} 
                            keyExtractor={item => item.id.toString()} 
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) => this.renderMenuFour(item)}
                            keyboardShouldPersistTaps="always"
                        />
                    </View> 
                    <View style={{flexDirection: "row"}}>
                        
                        <View style={styles.divider} />
                        <Text style={styles.menuTitle}>
                            Winter <Text style={{fontWeight: "100", color: colors.blue}}>Menu</Text>
                        </Text>
                        <View style={styles.divider} />
                    </View>  
                    <View style={{flexDirection: "row", alignSelf: 'flex-start'}}>
                        <Text style={{marginLeft: 10, marginRight: 10}}>Week 1</Text>
                    </View> 
                    <View style={{height: 250,}}>
                        <FlatList 
                            data={this.state.menuBlueWeek1} 
                            keyExtractor={item => item.id.toString()} 
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) => this.renderWinterMenuOne(item)}
                            keyboardShouldPersistTaps="always"
                        />
                    </View> 
                    <View style={{flexDirection: "row", alignSelf: 'flex-start'}}>
                        <Text style={{marginLeft: 10, marginRight: 10}}>Week 2</Text>
                    </View> 
                    <View style={{height: 250,}}>
                        <FlatList 
                            data={this.state.menuBlueWeek2} 
                            keyExtractor={item => item.id.toString()} 
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) => this.renderWinterMenuTwo(item)}
                            keyboardShouldPersistTaps="always"
                        />
                    </View> 
                    <View style={{flexDirection: "row", alignSelf: 'flex-start'}}>
                        <Text style={{marginLeft: 10, marginRight: 10}}>Week 3</Text>
                    </View> 
                    <View style={{height: 250,}}>
                        <FlatList 
                            data={this.state.menuBlueWeek3} 
                            keyExtractor={item => item.id.toString()} 
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) => this.renderWinterMenuThree(item)}
                            keyboardShouldPersistTaps="always"
                        />
                    </View>
                    <View style={{flexDirection: "row", alignSelf: 'flex-start'}}>
                        <Text style={{marginLeft: 10, marginRight: 10}}>Week 4</Text>
                    </View> 
                    <View style={{height: 250,}}>
                        <FlatList 
                            data={this.state.menuBlueWeek4} 
                            keyExtractor={item => item.id.toString()} 
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) => this.renderWinterMenuFour(item)}
                            keyboardShouldPersistTaps="always"
                        />
                    </View>
                    </View>  
                </ScrollView>
          
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