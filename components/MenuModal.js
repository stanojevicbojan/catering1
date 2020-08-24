import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity,  KeyboardAvoidingView, TextInput, Alert } from 'react-native';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import colors from '../Colors'
import { SwipeListView } from 'react-native-swipe-list-view';
import firebase from '../database/firebaseDb';


export default class MenuModal extends React.Component {
    state = {
        newTodo: "",
    }
//adds one item in the array to shopping list 
    addToShoppingList = (index) => {
        let list = this.props.list
        firebase.firestore().collection('users').doc('1mXHCyEEYnhyIqiqyeqi').collection('lists').doc('PHctNyYf5MHyofyNkW2j').update({todos: firebase.firestore.FieldValue.arrayUnion({"completed": true, "title": list.todos[index].title, "counter": list.todos[index].counter})}).then(alert("Item added to shopping list!"))
    }
//adds all items from the array to shopping list 
    addAllToShoppingList = () => {
        let list = this.props.list
        for ( let i=0; i<list.todos.length; i++) {
        firebase.firestore().collection('users').doc('1mXHCyEEYnhyIqiqyeqi').collection('lists').doc('PHctNyYf5MHyofyNkW2j').update({todos: firebase.firestore.FieldValue.arrayUnion({"completed": true, "title": list.todos[i].title, "counter": list.todos[i].counter})})
        }
        alert("Items added to shopping list!")
    }

    toggleTodoCompleted = index => {
        let list = this.props.list
        list.todos[index].completed = !list.todos[index].completed
        this.props.updateList(list)
    }

    increaseAmount = index => {
        let list = this.props.list
        list.todos[index].counter = list.todos[index].counter + 1
        this.props.updateList(list)
    }

    decreaseAmount = index => {
        let list = this.props.list
        if (list.todos[index].counter > 0 ) {
        list.todos[index].counter = list.todos[index].counter - 1
        } else if (list.todos[index].counter == 0) {
            list.todos[index].counter == 0
        }
        this.props.updateList(list)  
    }

    addTodo = () => {
        let list = this.props.list
        list.todos.push({title: this.state.newTodo, completed: false, counter:1 })

        this.props.updateList(list)
        this.setState({newTodo: "" })

        //if dismissing keyboard is needed
        //Keyboard.dismiss()
    }

    deleteTodo = index => {
        let list = this.props.list

        list.todos.splice(index, 1)

        this.props.updateList(list)
    }

    renderTodo = (todo, index) => {
        return (
                <View style={styles.todoContainer}>

                   {/* <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
                            <Ionicons name={todo.completed? 'ios-square' : 'ios-square-outline'} size={24} color={colors.gray} />
        </TouchableOpacity>*/}
                    <Text style={[styles.todo, {
                            textDecorationLine: todo.completed ? 'line-through' : "none", 
                            color: todo.completed ? colors.gray : colors.black}]}>{todo.title
                            }
                    </Text>
                    

                    <TouchableOpacity style={styles.deleteContainer} onPress={() => this.deleteTodo(index)}>
                            <Ionicons style={styles.deleteButton} name={'md-trash'} size={38} color={colors.gray} />
                    </TouchableOpacity>
                </View>
        )
    }

    addToFavorites = (item) => {
        let foodName = "favorites.".concat(item.title)
        firebase.firestore().collection('lists').doc('favorites').update({[`${foodName}`]: true}).then(function() {
            Alert.alert(
                "Success!",
                `Successfully added ${item.title} to the favorites.`,
                [
                  { text: "OK", onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
              );
        }); 
    }


  render() {
      const list = this.props.list
    return (
        <KeyboardAvoidingView keyboardVerticalOffset={60} style={{flex: 1}} behavior="height">
            <SafeAreaView style={styles.container}>
                <TouchableOpacity 
                    style={{position: "absolute", top: 38, right: 32, zIndex: 10}}
                    onPress={this.props.closeModal}
                >
                    <AntDesign name="close" size={24} color={colors.black} />
                </TouchableOpacity>

                <View style={[styles.section, styles.header, {borderBottomColor: list.color}]}>
                    <View style={styles.headerRow}>
                        <View>
                        <TouchableOpacity style={styles.addAllToCart} onPress={() => this.addAllToShoppingList()}>
                            <Text style={{color: 'white', fontWeight: '700', textAlign: 'center'}}>Add all to Cart</Text>
                            <MaterialCommunityIcons name={'cart-arrow-up'} size={18} color={'white'} />
                        </TouchableOpacity>
                        </View>
                        <Text style={styles.title}>{list.name}</Text>
                    </View>
                </View>
                
                <View style={[styles.section, {flex: 10}]}>
                    <SwipeListView
                        data={list.todos}
                        renderItem={({ item, index }) => 
                        <View style={styles.rowFront}>
                            <TouchableOpacity  onPress={() => this.decreaseAmount(index)}>
                            <Ionicons name={'ios-remove-circle'} size={38} color={"#E1E2E1"} />
                            </TouchableOpacity>
                            <Text style={styles.counterText}>{item.counter}</Text>
                            <TouchableOpacity  onPress={() => this.increaseAmount(index)}>
                            <Ionicons name={'ios-add-circle'} size={38} color={"#E1E2E1"} />
                            </TouchableOpacity>
                            <Text style={[styles.todo]}>{item.title}</Text>
                            <TouchableOpacity style={{justifyContent: 'center', marginLeft: 5}}  onPress={() => this.addToFavorites(item)}>
                                <Ionicons name={'ios-star-outline'} size={28} color={"#E1E2E1"} />
                            </TouchableOpacity>
                        </View>
                        }
                        //this.renderTodo(item, index)}
                        renderHiddenItem={({ item, index }) => (
                            <View style={styles.rowBack}>
                                <TouchableOpacity style={styles.addToCart} onPress={() => this.addToShoppingList(index)}>
                                <MaterialCommunityIcons name={'cart-arrow-up'} size={30} color={'#ec407a'} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                style={[styles.backRightBtn, styles.backRightBtnRight]}
                                onPress={() => this.deleteTodo(index)}
                                >
                                <Text style={styles.backTextWhite}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(_, index) => index.toString()}
                        leftOpenValue={75}
                        rightOpenValue={-75}
                        contentContainerStyle={{paddingHorizontal: 32, paddingVertical: 64}}
                        showsVerticalScrollIndicator={false}
                    />

                </View>
                
                <View style={[styles.section, styles.footer]}>
                    <TextInput 
                        style={[styles.input, {borderColor: list.color}]}
                        onChangeText={text => this.setState({newTodo: text})}
                        value={this.state.newTodo}
                    />
                    <TouchableOpacity
                        style={[styles.addTodo, {backgroundColor: list.color}]}
                        onPress={() => this.addTodo()}
                    >
                        <AntDesign name="plus" size={16} color={colors.white} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    section: {
        flex: 1,
        alignSelf: 'stretch',
    },
    header: {
        justifyContent: 'flex-end',
        marginLeft: 44,
        marginRight: 150,
        
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        color: colors.black,
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: colors.gray,
        fontWeight: "700"
    },
    footer: {
        paddingHorizontal: 32,
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8,
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    todo: {
        flex: 1,
        color: colors.black,
        fontWeight: "700",
        fontSize: 22,
        marginLeft: 8,
        maxWidth: 250,
        paddingTop: 10,
        paddingBottom: 10,
    },
    deleteContainer: {
        flex: 1,
    },
    deleteButton: {
        alignSelf: 'flex-end'
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fffffe',
        borderBottomColor: '#f1f1f1',
        borderBottomWidth: 1,
        borderTopColor: '#f1f1f1',
        borderTopWidth: 1,
        //justifyContent: 'center',
        height: 80,
        marginBottom: 5,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        marginBottom: 6,
        
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    counterText: {
        fontSize: 25,
        marginRight: 10,
        marginLeft: 10,
    },
    addToCart: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    addAllToCart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#009faf',
        padding: 10,
        borderRadius: 20,
        marginBottom: -8,
        marginLeft: -40,
        marginRight: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})